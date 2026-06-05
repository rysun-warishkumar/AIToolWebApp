#!/usr/bin/env node
/**
 * Writes robots.txt and llms.txt with the production site URL before build.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const loadEnv = () => {
  const envPath = path.join(__dirname, '..', '.env.production')
  if (fs.existsSync(envPath)) {
    const text = fs.readFileSync(envPath, 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(/^VITE_SITE_URL=(.+)$/)
      if (m) return m[1].trim().replace(/^["']|["']$/g, '')
    }
  }
  return process.env.VITE_SITE_URL || 'https://freeaitools.wtechnology.in'
}

const siteUrl = loadEnv().replace(/\/$/, '')

const robots = `# Free AI Tools Library — ${siteUrl}
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Disallow: /admin
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`

const llms = `# Free AI Tools Library

> ${siteUrl} — Curated free AI tools, copy-ready prompt templates, and Learning Zone guides.

## Site purpose
Free AI Tools Library helps users discover AI software, copy ChatGPT/Claude/Gemini prompts, and learn about AI agents, MCP servers, LLMs, and prompt engineering.

## Primary topics
- Free AI tools directory (writing, coding, image, productivity)
- AI prompt templates (copy-paste, categorized by skill level)
- Tutorials: AI agents, MCP servers, LLM basics, prompt engineering, web integration, fine-tuning

## Key public URLs
- Home: ${siteUrl}/
- AI Tools: ${siteUrl}/tools
- Prompt Library: ${siteUrl}/prompts
- Learning Zone: ${siteUrl}/learning
- About: ${siteUrl}/about
- Contact: ${siteUrl}/contact

## Search
- Tools: ${siteUrl}/tools?search={query}
- Prompts: ${siteUrl}/prompts?search={query}

## API
- GET ${siteUrl}/api/tools
- GET ${siteUrl}/api/prompts
- GET ${siteUrl}/api/articles

## Contact
- ${siteUrl}/contact

Sitemap: ${siteUrl}/sitemap.xml
`

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots)
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms)

const staticSitemapUrls = ['/', '/tools', '/prompts', '/learning', '/about', '/contact', '/privacy', '/terms', '/cookie-policy']
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticSitemapUrls
  .map(
    (p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc><changefreq>${p === '/' ? 'daily' : 'weekly'}</changefreq></url>`
  )
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
console.log(`SEO assets generated for ${siteUrl}`)
