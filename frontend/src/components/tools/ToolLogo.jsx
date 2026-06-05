import { Wrench } from 'lucide-react'
import { getMediaUrl } from '../../utils/helpers'

export default function ToolLogo({ name, logoUrl, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
  }
  const sizeClass = sizes[size] || sizes.md

  if (logoUrl) {
    return (
      <img
        src={getMediaUrl(logoUrl)}
        alt=""
        className={`${sizeClass} rounded-lg object-cover bg-white dark:bg-dark-700 border border-gray-100 dark:border-dark-600 shrink-0 ${className}`}
        loading="lazy"
      />
    )
  }

  const initial = (name || '?').charAt(0).toUpperCase()

  return (
    <div
      className={`${sizeClass} rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${className}`}
      aria-hidden
    >
      {initial || <Wrench className="w-1/2 h-1/2" />}
    </div>
  )
}
