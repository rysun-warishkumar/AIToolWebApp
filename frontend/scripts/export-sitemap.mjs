#!/usr/bin/env node
/**
 * Fetches published tools, prompts, and articles from the API and writes sitemap.xml.
 * Usage: node scripts/export-sitemap.mjs [--api https://freeaitools.wtechnology.in/api]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const loadSiteUrl = () => {
  const envPath = path.join(__dirname, '..', '.env.production')
  if (fs.existsSync(envPath)) {
    const text = fs.readFileSync(envPath, 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(/^VITE_SITE_URL=(.+)$/)
      if (m) return m[1].trim().replace(/^["']|["']$/g, '').replace(/\/$/, '')
    }
  }
  return (process.env.VITE_SITE_URL || 'https://freeaitools.wtechnology.in').replace(/\/$/, '')
}

const apiArg = process.argv.find((a) => a.startsWith('--api='))
const apiBase = (apiArg ? apiArg.slice(6) : process.env.VITE_API_URL || 'https://freeaitools.wtechnology.in/api').replace(
  /\/$/,
  ''
)

const siteUrl = loadSiteUrl()

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : null)

async function fetchAll(endpoint) {
  const items = []
  let page = 1
  const limit = 100
  while (true) {
    const res = await fetch(`${apiBase}${endpoint}?page=${page}&perPage=${limit}`)
    if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`)
    const json = await res.json()
    items.push(...(json.data || []))
    const total = json.meta?.total ?? items.length
    if (items.length >= total || !(json.data?.length)) break
    page += 1
  }
  return items
}

const staticPaths = [
  { loc: '/', pri: '1.0', freq: 'daily' },
  { loc: '/tools', pri: '0.9', freq: 'daily' },
  { loc: '/prompts', pri: '0.9', freq: 'daily' },
  { loc: '/learning', pri: '0.9', freq: 'weekly' },
  { loc: '/about', pri: '0.6', freq: 'monthly' },
  { loc: '/contact', pri: '0.6', freq: 'monthly' },
  { loc: '/privacy', pri: '0.3', freq: 'yearly' },
  { loc: '/terms', pri: '0.3', freq: 'yearly' },
  { loc: '/cookie-policy', pri: '0.3', freq: 'yearly' },
]

const urls = staticPaths.map((p) => ({
  loc: `${siteUrl}${p.loc}`,
  pri: p.pri,
  freq: p.freq,
}))

console.log(`Fetching from ${apiBase}…`)

try {
  const [tools, prompts, articles] = await Promise.all([
    fetchAll('/tools'),
    fetchAll('/prompts'),
    fetch(`${apiBase}/articles`)
      .then((r) => {
        if (!r.ok) throw new Error(`articles failed: ${r.status}`)
        return r.json()
      })
      .then((j) => j.data || []),
  ])

  for (const t of tools) {
    urls.push({
      loc: `${siteUrl}/tools/${t.id}`,
      pri: '0.7',
      freq: 'weekly',
      lastmod: formatDate(t.updated_at),
    })
  }
  for (const p of prompts) {
    urls.push({
      loc: `${siteUrl}/prompts/${p.id}`,
      pri: '0.7',
      freq: 'weekly',
      lastmod: formatDate(p.updated_at),
    })
  }
  for (const a of articles) {
    urls.push({
      loc: `${siteUrl}/learning/${a.slug}`,
      pri: '0.8',
      freq: 'monthly',
      lastmod: formatDate(a.updated_at),
    })
  }

  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>${lastmod}\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`
    })
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

  const outPath = path.join(publicDir, 'sitemap.xml')
  fs.writeFileSync(outPath, sitemap)
  console.log(`Wrote ${urls.length} URLs to ${outPath}`)
  console.log(`  Static pages: ${staticPaths.length}`)
  console.log(`  Tools: ${tools.length}`)
  console.log(`  Prompts: ${prompts.length}`)
  console.log(`  Articles: ${articles.length}`)
} catch (err) {
  const outPath = path.join(publicDir, 'sitemap.xml')
  if (fs.existsSync(outPath)) {
    console.warn(`Sitemap export skipped (${err.message}); keeping existing ${outPath}`)
    process.exit(0)
  }
  console.error(`Sitemap export failed: ${err.message}`)
  process.exit(1)
}
