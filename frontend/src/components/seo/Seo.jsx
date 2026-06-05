import { useEffect } from 'react'
import { SITE } from '../../config/site'
import { SEO_KEYWORDS } from '../../config/seo'

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

const upsertLink = (rel, href, extra = {}) => {
  if (!href) return
  const selector = extra.type ? `link[rel="${rel}"][type="${extra.type}"]` : `link[rel="${rel}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra.type) el.setAttribute('type', extra.type)
    if (extra.title) el.setAttribute('title', extra.title)
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

const organizationSchema = () => ({
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  description: SITE.description,
  email: SITE.email,
  knowsAbout: SITE.topics,
})

const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  description: SITE.description,
  inLanguage: SITE.language,
  publisher: { '@id': `${SITE.url}/#organization` },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/tools?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/prompts?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
})

/**
 * Per-route SEO for Google, Bing, social previews, and AI crawlers (GPTBot, Google-Extended, etc.).
 */
export default function Seo({
  title,
  description = SITE.description,
  path = '',
  image,
  type = 'website',
  keywords = [],
  noindex = false,
  jsonLd,
  breadcrumbs = [],
}) {
  const fullTitle = title ? `${title} | ${SITE.shortName}` : `${SITE.name} — Free AI Tools & Prompts`
  const canonical = `${SITE.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const ogImage = image || `${SITE.url}/og-default.png`
  const keywordString = [...new Set([...keywords, ...SEO_KEYWORDS])].slice(0, 24).join(', ')

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = SITE.language

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', keywordString)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    upsertMeta('name', 'googlebot', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('name', 'bingbot', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('name', 'author', SITE.name)
    upsertMeta('name', 'application-name', SITE.shortName)

    upsertLink('canonical', canonical)
    upsertLink('alternate', `${SITE.url}/llms.txt`, { type: 'text/plain', title: 'LLM site summary' })

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

    const graph = [organizationSchema(), websiteSchema()]

    if (breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE.url}${item.url}`,
        })),
      })
    }

    if (jsonLd) {
      graph.push(jsonLd)
    }

    upsertJsonLd('seo-jsonld', {
      '@context': 'https://schema.org',
      '@graph': graph,
    })

    return () => {
      const el = document.getElementById('seo-jsonld')
      if (el) el.remove()
    }
  }, [fullTitle, description, canonical, ogImage, type, keywordString, noindex, jsonLd, breadcrumbs])

  return null
}

/** FAQ rich results + AI answer engines */
export function buildFaqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function buildToolSchema(tool) {
  return {
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.short_description || tool.description,
    applicationCategory: tool.category_name || 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: tool.pricing_model === 'free' ? '0' : undefined,
      priceCurrency: 'USD',
    },
    url: tool.website_url,
  }
}

export function buildPromptSchema(prompt) {
  return {
    '@type': 'CreativeWork',
    name: prompt.title,
    description: prompt.short_description || prompt.preview_text,
    keywords: prompt.category_name,
    educationalLevel: prompt.complexity,
  }
}

export function buildArticleSchema(article) {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    dateModified: article.updated_at,
    timeRequired: `PT${article.read_time_minutes || 10}M`,
    articleSection: article.category,
    inLanguage: SITE.language,
  }
}
