import { useEffect, useState } from 'react'
import { X, ExternalLink, Bookmark, Share2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { toolsAPI } from '../../services/api'
import { recordOncePerSession } from '../../utils/analytics'
import ToolLogo from './ToolLogo'

export const ToolDetailModal = ({ tool, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  const [viewCount, setViewCount] = useState(tool?.view_count ?? 0)

  useEffect(() => {
    if (tool) setViewCount(tool.view_count ?? 0)
  }, [tool])

  useEffect(() => {
    if (!isOpen || !tool?.id) return
    recordOncePerSession(`tool-view-${tool.id}`, () =>
      toolsAPI.recordView(tool.id).then((res) => {
        if (res.data?.view_count != null) setViewCount(res.data.view_count)
      })
    )
  }, [isOpen, tool?.id])

  if (!isOpen || !tool) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleCopyWebsite = () => {
    navigator.clipboard.writeText(tool.website_url)
    toast.success('Website URL copied!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
          <div className="flex items-center gap-4">
            <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="lg" className="!w-16 !h-16" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.category_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pricing</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">
                {tool.pricing_model}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">
                {tool.status}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Views</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {viewCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Featured</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {tool.is_featured ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">{tool.short_description}</p>
          </div>

          {/* Full Description */}
          {tool.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {tool.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={() => window.open(tool.website_url, '_blank', 'noopener,noreferrer')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </button>
            <button
              onClick={() => onToggleFavorite(tool)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFavorite(tool.id)
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite(tool.id) ? 'fill-current' : ''}`} />
              {isFavorite(tool.id) ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleCopyWebsite}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              title="Copy website URL"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              title="Share this tool"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
