import { BookOpen } from 'lucide-react'
import { getMediaUrl } from '../../utils/helpers'

const iconMap = {
  'AI Agents': '⚡',
  Integration: '🔌',
  Fundamentals: '📘',
  Prompting: '✍️',
  'Web Integration': '🌐',
  'Advanced AI': '🚀',
  General: '📖',
}

export default function ArticleCover({ title, category, coverImageUrl, className = '' }) {
  const src = coverImageUrl ? getMediaUrl(coverImageUrl) : null

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-dark-700 ${className}`}>
        <img
          src={src}
          alt={title ? `${title} cover` : ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    )
  }

  return (
    <div
      className={`bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center ${className}`}
    >
      {iconMap[category] ? (
        <span className="text-5xl opacity-60" role="img" aria-hidden>
          {iconMap[category]}
        </span>
      ) : (
        <BookOpen className="w-14 h-14 text-primary-500 opacity-40" />
      )}
    </div>
  )
}
