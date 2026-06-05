import { useEffect } from 'react'
import { SITE } from '../../config/site'

const upsertMeta = (attr, key, content) => {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const upsertLink = (rel, href) => {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const upsertJsonLd = (id, data) => {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Per-route SEO for Google, social previews, and AI crawlers that read HTML meta.
 */
export default function Seo({
  title,
  description = SITE.description,
  path = '',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — AI Tools & Prompts`
  const canonical = `${SITE.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const ogImage = image || `${SITE.url}/og-default.png`

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = 'en'

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    upsertMeta('name', 'author', SITE.name)

    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', SITE.name)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:locale', SITE.locale)
    upsertMeta('property', 'og:image', ogImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)
    if (SITE.twitter) upsertMeta('name', 'twitter:site', SITE.twitter)

    const defaultLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      description: SITE.description,
      url: SITE.url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE.url}/tools?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }
    upsertJsonLd('seo-jsonld', jsonLd || defaultLd)

    return () => {
      const el = document.getElementById('seo-jsonld')
      if (el && !jsonLd) el.remove()
    }
  }, [fullTitle, description, canonical, ogImage, type, noindex, jsonLd])

  return null
}
