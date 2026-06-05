/** Record a one-time event per browser session (avoids double-count on re-renders). */
export const recordOncePerSession = (key, fn) => {
  const storageKey = `analytics:${key}`
  if (sessionStorage.getItem(storageKey)) return
  sessionStorage.setItem(storageKey, '1')
  fn().catch(() => {})
}
