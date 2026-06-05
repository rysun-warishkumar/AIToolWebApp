/** Normalize API list responses (array or { data: [] }) */
export const normalizeListResponse = (res) => {
  const d = res?.data
  if (Array.isArray(d)) return d
  if (Array.isArray(d?.data)) return d.data
  return []
}

export const getMediaUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  const origin = api.replace(/\/api\/?$/, '')
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`
}

// String utilities
export const slug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const truncate = (text, length = 100) => {
  return text.length > length ? text.slice(0, length) + '...' : text
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

// Format date
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatRelativeDate = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return formatDate(date)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

// URL utilities
export const openExternal = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const isExternalLink = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.host !== window.location.host
  } catch {
    return false
  }
}

// Query utilities
export const buildQueryString = (params) => {
  const entries = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
  return entries.length ? '?' + entries.join('&') : ''
}

export const parseQueryString = (search) => {
  const params = new URLSearchParams(search)
  const result = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

// Pagination utilities
export const getPaginationArray = (current, total, limit = 5) => {
  const pages = []
  let start = Math.max(1, current - Math.floor(limit / 2))
  let end = Math.min(total, start + limit - 1)
  
  if (end - start < limit - 1) {
    start = Math.max(1, end - limit + 1)
  }

  if (start > 1) pages.push(1)
  if (start > 2) pages.push('...')
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < total - 1) pages.push('...')
  if (end < total) pages.push(total)
  
  return pages
}

// Search utilities
export const debounce = (func, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

export const highlightText = (text, query) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Badge/label utilities
export const getPricingLabel = (model) => {
  const labels = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
  }
  return labels[model] || model
}

export const getComplexityLabel = (level) => {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  }
  return labels[level] || level
}

export const getStatusBadge = (status) => {
  const badges = {
    published: { label: 'Published', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    archived: { label: 'Archived', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  }
  return badges[status] || { label: status, color: 'bg-gray-100' }
}
