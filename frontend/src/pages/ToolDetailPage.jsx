import { useParams, useNavigate } from 'react-router-dom'
import { ExternalLink, Bookmark, Share2, ChevronLeft } from 'lucide-react'
import { useTool } from '../hooks/useQueries'
import { SkeletonDetailPage } from '../components/common/Skeleton'
import ToolLogo from '../components/tools/ToolLogo'

export default function ToolDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: tool, isLoading, error } = useTool(id)

  if (isLoading) return <SkeletonDetailPage />

  if (error || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
          <button
            onClick={() => navigate('/tools')}
            className="btn-primary"
          >
            Back to Tools
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Tools
          </button>

          <div className="flex items-start gap-6 mb-8">
            <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="lg" className="!w-24 !h-24" />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{tool.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {tool.short_description}
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="badge">
                  {tool.category_name}
                </span>
                <span className="badge">
                  {tool.pricing_model.charAt(0).toUpperCase() + tool.pricing_model.slice(1)}
                </span>
                {tool.is_featured && (
                  <span className="badge bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Visit Website
              <ExternalLink className="w-5 h-5" />
            </a>
            <button className="btn-secondary inline-flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Save
            </button>
            <button className="btn-secondary inline-flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {tool.description && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                >
                  {tool.description}
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <ul className="space-y-3">
                {[
                  'Advanced AI capabilities',
                  'User-friendly interface',
                  'Real-time processing',
                  'Customizable settings',
                  'API access',
                  'Multi-platform support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Tool Information</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Category</dt>
                  <dd className="text-gray-900 dark:text-white">{tool.category_name}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Pricing Model</dt>
                  <dd className="text-gray-900 dark:text-white capitalize">
                    {tool.pricing_model}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">Views</dt>
                  <dd className="text-gray-900 dark:text-white">{tool.view_count}</dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Link Info */}
            <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
              <div className="flex gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    External Link
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    This opens the tool's website in a new tab for your security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
