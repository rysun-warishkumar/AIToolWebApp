import { useParams, useNavigate } from 'react-router-dom'
import { Copy, Share2, ChevronLeft } from 'lucide-react'
import { usePrompt } from '../hooks/useQueries'
import { copyToClipboard } from '../utils/helpers'
import { SkeletonDetailPage } from '../components/common/Skeleton'
import { toast } from 'sonner'

export default function PromptDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: prompt, isLoading, error } = usePrompt(id)

  if (isLoading) return <SkeletonDetailPage />

  if (error || !prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Prompt not found</h1>
          <button
            onClick={() => navigate('/prompts')}
            className="btn-primary"
          >
            Back to Prompts
          </button>
        </div>
      </div>
    )
  }

  const handleCopy = async () => {
    const copied = await copyToClipboard(prompt.content)
    if (copied) {
      toast.success('Prompt copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/prompts')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Prompts
          </button>

          <h1 className="text-4xl font-bold mb-4">{prompt.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {prompt.short_description}
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="badge">{prompt.category_name}</span>
            <span className="badge">{prompt.complexity}</span>
            <span className="badge-secondary">{prompt.copy_count} copies</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Prompt Content */}
            <div className="card p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Full Prompt</h2>
              <div className="relative">
                <pre className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-words">
                  {prompt.content}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 btn-secondary p-2 hover:bg-gray-200 dark:hover:bg-dark-700"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview */}
            {prompt.preview_text && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4">Preview</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {prompt.preview_text}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Info Card */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Information</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Category</dt>
                  <dd className="text-gray-900 dark:text-white">{prompt.category_name}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Complexity</dt>
                  <dd className="text-gray-900 dark:text-white capitalize">
                    {prompt.complexity}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Type</dt>
                  <dd className="text-gray-900 dark:text-white capitalize">
                    {prompt.prompt_type}
                  </dd>
                </div>
                {prompt.industry && (
                  <div>
                    <dt className="text-gray-600 dark:text-gray-400 font-medium">Industry</dt>
                    <dd className="text-gray-900 dark:text-white">{prompt.industry}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Copies</dt>
                  <dd className="text-gray-900 dark:text-white">{prompt.copy_count}</dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleCopy}
              className="w-full btn-primary inline-flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5" />
              Copy Full Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
