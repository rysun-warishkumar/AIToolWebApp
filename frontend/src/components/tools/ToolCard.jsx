import { useState } from 'react'
import { ExternalLink, Copy, Bookmark, Star } from 'lucide-react'
import { getPricingLabel, truncate, copyToClipboard } from '../../utils/helpers'
import { ToolDetailModal } from './ToolDetailModal'
import { PromptDetailModal } from '../prompts/PromptDetailModal'
import PromptExampleImage from '../prompts/PromptExampleImage'
import { useFavorites } from '../../hooks/useLocalStorage'
import ToolLogo from './ToolLogo'
import { toast } from 'sonner'

export const ToolCard = ({ tool, featured = false, viewType = 'grid' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const isList = viewType === 'list'

  const handleCardClick = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const footer = (
    <div
      className={`flex items-center justify-between ${
        isList ? 'sm:flex-col sm:items-end sm:justify-center sm:gap-2 sm:pl-4 sm:border-l sm:border-gray-100 dark:sm:border-dark-700' : 'pt-4 border-t border-gray-100 dark:border-dark-700'
      }`}
    >
      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {(tool.view_count ?? 0).toLocaleString()} views
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            window.open(tool.website_url, '_blank', 'noopener,noreferrer')
          }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
          title="Open website"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(tool)
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite(tool.id) ? 'bg-yellow-100 dark:bg-yellow-900' : 'hover:bg-gray-100 dark:hover:bg-dark-700'
          }`}
          title="Save for later"
        >
          <Bookmark className={`w-4 h-4 ${isFavorite(tool.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`card hover-lift group cursor-pointer ${
          isList ? 'p-4 sm:p-5 flex flex-col sm:flex-row sm:items-stretch gap-4' : 'p-5 flex flex-col'
        }`}
      >
        {isList ? (
          <>
            <div className="flex items-center gap-3 sm:w-52 shrink-0">
              <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="lg" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 sm:hidden">
                {tool.name}
              </h3>
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="hidden sm:flex items-start gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1 flex-1">
                  {tool.name}
                </h3>
                {featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 sm:line-clamp-3">
                {truncate(tool.short_description, 120)}
              </p>
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-0 sm:flex-1 sm:items-end">
                <span className="badge-secondary text-xs">{tool.category_name}</span>
                <span className="badge text-xs">{getPricingLabel(tool.pricing_model)}</span>
              </div>
              <div className="sm:hidden">{footer}</div>
            </div>
            <div className="hidden sm:flex">{footer}</div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="md" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 flex-1 min-w-0">
                {tool.name}
              </h3>
              {featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
              {truncate(tool.short_description, 80)}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-secondary text-xs">{tool.category_name}</span>
              <span className="badge text-xs">{getPricingLabel(tool.pricing_model)}</span>
            </div>
            {footer}
          </>
        )}
      </div>

      <ToolDetailModal
        tool={tool}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />
    </>
  )
}

export const PromptCard = ({ prompt, onCopy }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleQuickCopy = async (e) => {
    e.stopPropagation()
    const copied = await copyToClipboard(prompt.content)
    if (copied) {
      toast.success(`Copied: ${prompt.title}`)
      onCopy?.(prompt)
    }
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="card hover-lift group cursor-pointer overflow-hidden flex flex-col h-full p-0"
      >
        <PromptExampleImage
          title={prompt.title}
          imageUrl={prompt.example_image_url}
          variant="card"
          className="rounded-t-xl shrink-0"
        />

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {prompt.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
            {truncate(prompt.short_description || prompt.preview_text || prompt.content, 100)}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge-secondary text-xs">{prompt.category_name}</span>
            <span className="badge text-xs capitalize">{prompt.complexity}</span>
          </div>
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-dark-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {(prompt.copy_count ?? 0).toLocaleString()} copies
            </div>
            <button
              type="button"
              onClick={handleQuickCopy}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              title="Copy prompt"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <PromptDetailModal prompt={prompt} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
