import { useEffect, useRef } from 'react'

/**
 * Google AdSense slot — enable with VITE_ADSENSE_CLIENT and VITE_ADSENSE_SLOT in .env
 * See docs/ADSENSE.md for setup steps.
 */
export default function AdSenseSlot({ format = 'auto', className = '' }) {
  const ref = useRef(null)
  const client = import.meta.env.VITE_ADSENSE_CLIENT
  const slot = import.meta.env.VITE_ADSENSE_SLOT

  useEffect(() => {
    if (!client || !slot || !ref.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* AdSense script not loaded yet */
    }
  }, [client, slot])

  if (!client || !slot) return null

  return (
    <div className={`adsense-container overflow-hidden ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
