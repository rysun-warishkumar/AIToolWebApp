import { ImageIcon, Sparkles } from 'lucide-react'
import { getMediaUrl } from '../../utils/helpers'

/**
 * Example output preview for prompt cards and detail views.
 * Renders a polished placeholder when no image is set.
 */
export default function PromptExampleImage({
  title,
  imageUrl,
  variant = 'card',
  className = '',
}) {
  const src = imageUrl ? getMediaUrl(imageUrl) : null
  const isCard = variant === 'card'
  const isDetail = variant === 'detail'

  if (src) {
    return (
      <div
        className={`relative overflow-hidden bg-gray-100 dark:bg-dark-700 ${
          isCard ? 'aspect-[16/10]' : isDetail ? 'aspect-[21/9] max-h-72' : 'aspect-video'
        } ${className}`}
      >
        <img
          src={src}
          alt={title ? `Example output for ${title}` : 'Prompt example output'}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        {isCard && (
          <span className="absolute bottom-2 left-2 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-md bg-black/50 text-white backdrop-blur-sm">
            Example output
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center text-center ${
        isCard
          ? 'aspect-[16/10] bg-gradient-to-br from-violet-50 via-primary-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-primary-950/30 dark:to-fuchsia-950/20'
          : isDetail
            ? 'aspect-[21/9] max-h-48 bg-gradient-to-br from-violet-50 to-primary-50 dark:from-violet-950/30 dark:to-primary-950/20'
            : 'aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-700'
      } ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '16px 16px',
        }}
        aria-hidden
      />
      <div className={`relative flex flex-col items-center gap-1.5 ${isCard ? 'px-4' : 'px-6'}`}>
        <div
          className={`rounded-xl flex items-center justify-center ${
            isCard ? 'w-10 h-10' : 'w-12 h-12'
          } bg-white/70 dark:bg-dark-800/70 shadow-sm`}
        >
          {isCard ? (
            <Sparkles className="w-5 h-5 text-primary-500 opacity-80" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
        {isCard && (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Prompt template</p>
        )}
        {isDetail && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No example output image</p>
        )}
      </div>
    </div>
  )
}
