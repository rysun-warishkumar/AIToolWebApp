import { useEffect, useState } from 'react'
import { X, Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { promptsAPI } from '../../services/api'
import PromptExampleImage from './PromptExampleImage'

export const PromptDetailModal = ({ prompt, isOpen, onClose }) => {
  const [copyCount, setCopyCount] = useState(prompt?.copy_count ?? 0)

  useEffect(() => {
    if (prompt) setCopyCount(prompt.copy_count ?? 0)
  }, [prompt])

  if (!isOpen || !prompt) return null

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      const res = await promptsAPI.incrementCopy(prompt.id)
      if (res.data?.copy_count != null) {
        setCopyCount(res.data.copy_count)
      } else {
        setCopyCount((c) => c + 1)
      }
      toast.success('Prompt copied to clipboard!')
    } catch {
      toast.error('Failed to copy prompt')
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/prompts/${prompt.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{prompt.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{prompt.category_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors flex-shrink-0 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {prompt.example_image_url && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Example output</h3>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-dark-600">
                <PromptExampleImage
                  title={prompt.title}
                  imageUrl={prompt.example_image_url}
                  variant="detail"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Category</p>
              <p className="font-semibold text-gray-900 dark:text-white">{prompt.category_name}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Complexity</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{prompt.complexity}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Copies</p>
              <p className="font-semibold text-gray-900 dark:text-white">{copyCount.toLocaleString()}</p>
            </div>
          </div>

          {prompt.preview_text && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Preview</h3>
              <p className="text-gray-600 dark:text-gray-400">{prompt.preview_text}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prompt Content</h3>
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                {prompt.content}
              </p>
            </div>
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
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

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={handleCopyPrompt}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Prompt
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              title="Share this prompt"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
