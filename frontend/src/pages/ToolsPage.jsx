import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid3x3, List, X } from 'lucide-react'
import { useTools, useCategories } from '../hooks/useQueries'
import { debounce } from '../utils/helpers'
import { ToolCard } from '../components/tools/ToolCard'
import { Pagination, ActiveFilters, EmptyState } from '../components/common/Pagination'
import { SkeletonList } from '../components/common/Skeleton'
import Seo from '../components/seo/Seo'
import { PAGE_SEO } from '../config/seo'

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewType, setViewType] = useState('grid')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef(null)

  // URL params
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '12')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const pricing = searchParams.get('pricing') || ''
  const sortBy = searchParams.get('sortBy') || 'popularity_score'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  // Update local search value when URL params change
  useEffect(() => {
    setSearchValue(search)
  }, [search])

  // Data
  const { data, isLoading, error } = useTools(page, perPage, {
    search,
    category_id: category,
    pricing_model: pricing,
    sortBy,
    sortOrder,
  })

  const { data: categories, isLoading: categoriesLoading } = useCategories('tool')

  // Handlers with debouncing
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

  const totalPages = data ? Math.ceil(data.meta.total / perPage) : 1
  const categoryLabel = categories?.find((c) => String(c.id) === String(category))?.name

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Seo
        title={PAGE_SEO.tools.title}
        description={PAGE_SEO.tools.description}
        keywords={PAGE_SEO.tools.keywords}
        path="/tools"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'AI Tools', url: '/tools' },
        ]}
      />
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Tools</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {data?.meta?.total || 0} tools available
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewType === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewType === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tools..."
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
        {/* Desktop Filter Sidebar + Content */}
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-6 sticky top-40">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                  Category
                </label>
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

              {/* Pricing */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                  Pricing
                </label>
                <select
                  value={pricing}
                  onChange={(e) => updateFilter('pricing', e.target.value)}
                  className="input"
                >
                  <option value="">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="input"
                >
                  <option value="popularity_score">Most Popular</option>
                  <option value="name">A-Z</option>
                  <option value="created_at">Newest</option>
                  <option value="view_count">Most Viewed</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(search || category || pricing) && (
                <button
                  onClick={clearAllFilters}
                  className="w-full btn-secondary text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {(search || category || pricing) && (
              <div className="mb-8">
                <ActiveFilters
                  filters={{
                    search,
                    category: categoryLabel || (category ? `ID ${category}` : ''),
                    pricing,
                  }}
                  onRemove={removeFilter}
                  onClear={clearAllFilters}
                />
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <SkeletonList />
            ) : error ? (
              <EmptyState
                title="Error loading tools"
                description="Please try again later"
              />
            ) : data?.data?.length === 0 ? (
              <EmptyState
                title="No tools found"
                description="Try adjusting your filters or search terms"
              />
            ) : (
              <>
                <div className={`${viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                  {data?.data?.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} viewType={viewType} />
                  ))}
                </div>

                {/* Pagination */}
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

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-800 rounded-t-2xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Same filters as desktop */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    updateFilter('category', e.target.value)
                    setShowMobileFilter(false)
                  }}
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

              <div>
                <label className="block text-sm font-semibold mb-3">Pricing</label>
                <select
                  value={pricing}
                  onChange={(e) => {
                    updateFilter('pricing', e.target.value)
                    setShowMobileFilter(false)
                  }}
                  className="input"
                >
                  <option value="">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
