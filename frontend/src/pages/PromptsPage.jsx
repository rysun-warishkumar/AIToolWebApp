import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Copy, X } from 'lucide-react'
import { usePrompts, useCategories } from '../hooks/useQueries'
import { debounce, copyToClipboard } from '../utils/helpers'
import { PromptCard } from '../components/tools/ToolCard'
import { Pagination, ActiveFilters, EmptyState } from '../components/common/Pagination'
import { SkeletonList } from '../components/common/Skeleton'
import { Toaster, toast } from 'sonner'
import Seo from '../components/seo/Seo'

export default function PromptsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef(null)

  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '12')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const complexity = searchParams.get('complexity') || ''
  const sortBy = searchParams.get('sortBy') || 'created_at'

  // Update local search value when URL params change
  useEffect(() => {
    setSearchValue(search)
  }, [search])

  const { data, isLoading, error } = usePrompts(page, perPage, {
    search,
    category_id: category,
    complexity,
    sortBy,
  })

  const { data: categories, isLoading: categoriesLoading } = useCategories('prompt')

  const handleSearch = useRef(
    debounce((value) => {
      const newParams = new URLSearchParams(searchParams)
      if (value) {
        newParams.set('search', value)
        newParams.set('page', '1')
      } else {
        newParams.delete('search')
      }
      setSearchParams(newParams)
    }, 300)
  ).current

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
      newParams.set('page', '1')
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const removeFilter = (key) => {
    updateFilter(key, '')
  }

  const clearAllFilters = () => {
    setSearchParams('')
  }

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage)
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePerPageChange = (newPerPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('perPage', newPerPage)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleCopyPrompt = async (promptText, promptTitle) => {
    const copied = await copyToClipboard(promptText)
    if (copied) {
      toast.success(`Copied: ${promptTitle}`)
    }
  }

  const totalPages = data ? Math.ceil(data.meta.total / perPage) : 1
  const categoryLabel = categories?.find((c) => String(c.id) === String(category))?.name

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Seo
        title="AI Prompt Templates"
        description="Browse copy-ready AI prompts by category and complexity."
        path="/prompts"
      />
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Prompt Library</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {data?.meta?.total || 0} prompts available
            </p>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search prompts..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                handleSearch(e.target.value)
              }}
              className="input pl-11"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-6 sticky top-40">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Category</label>
                <select
                  value={category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Complexity</label>
                <select
                  value={complexity}
                  onChange={(e) => updateFilter('complexity', e.target.value)}
                  className="input"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="input"
                >
                  <option value="created_at">Newest</option>
                  <option value="copy_count">Most Copied</option>
                  <option value="view_count">Most Viewed</option>
                </select>
              </div>

              {(search || category || complexity) && (
                <button
                  onClick={clearAllFilters}
                  className="w-full btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {(search || category || complexity) && (
              <div className="mb-8">
                <ActiveFilters
                  filters={{
                    search,
                    category: categoryLabel || (category ? `ID ${category}` : ''),
                    complexity,
                  }}
                  onRemove={removeFilter}
                  onClear={clearAllFilters}
                />
              </div>
            )}

            {isLoading ? (
              <SkeletonList />
            ) : error ? (
              <EmptyState title="Error loading prompts" />
            ) : data?.data?.length === 0 ? (
              <EmptyState title="No prompts found" />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.data?.map((prompt) => (
                    <div key={prompt.id} className="relative">
                      <PromptCard prompt={prompt} />
                      <button
                        onClick={() => handleCopyPrompt(prompt.content, prompt.title)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 shadow-sm"
                        title="Copy prompt"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
