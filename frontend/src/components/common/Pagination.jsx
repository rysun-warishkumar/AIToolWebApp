import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getPaginationArray } from '../../utils/helpers'

export const Pagination = ({ page, totalPages, onPageChange, perPage, onPerPageChange }) => {
  const pages = getPaginationArray(page, totalPages, 5)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
      {/* Per page selector */}
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="perPage" className="text-gray-700 dark:text-gray-300">
          Items per page:
        </label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => onPerPageChange(parseInt(e.target.value))}
          className="input py-1 px-2 w-20"
        >
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn-secondary py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-3 py-2 text-gray-600 dark:text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                page === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {totalPages}
      </div>
    </div>
  )
}

export const FilterChip = ({ label, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm">
      {label}
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity"
        aria-label="Remove filter"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ActiveFilters = ({ filters, onRemove, onClear }) => {
  if (Object.keys(filters).length === 0) return null

  const filterLabels = {
    search: (v) => `Search: "${v}"`,
    category: (v) => `Category: ${v}`,
    pricing: (v) => `Pricing: ${v}`,
    complexity: (v) => `Level: ${v}`,
    tag: (v) => `Tag: ${v}`,
    sortBy: (v) => `Sort: ${v}`,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(filters).map(([key, value]) =>
          value && (
            <FilterChip
              key={key}
              label={filterLabels[key]?.(value) || `${key}: ${value}`}
              onRemove={() => onRemove(key)}
            />
          )
        )}
      </div>
      {Object.keys(filters).length > 0 && (
        <button
          onClick={onClear}
          className="text-sm text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

export const EmptyState = ({ title = 'No results found', description = 'Try adjusting your filters or search terms' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        {description}
      </p>
    </div>
  )
}
