import { useMemo } from 'react'
import { ChevronRight, Filter, X, Clock, Eye } from 'lucide-react'
import ArticleCover from '../components/learning/ArticleCover'
import { Link, useSearchParams } from 'react-router-dom'
import { useArticles } from '../hooks/useQueries'
import { SkeletonList } from '../components/common/Skeleton'
import Seo from '../components/seo/Seo'

const DIFFICULTIES = [
  { value: '', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export default function LearningZonePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: articles = [], isLoading } = useArticles()

  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''

  const categoryOptions = useMemo(() => {
    const counts = {}
    articles.forEach((a) => {
      if (a.category) counts[a.category] = (counts[a.category] || 0) + 1
    })
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count }))
  }, [articles])

  const difficultyCounts = useMemo(() => {
    const counts = { beginner: 0, intermediate: 0, advanced: 0 }
    articles.forEach((a) => {
      if (counts[a.difficulty] !== undefined) counts[a.difficulty]++
    })
    return counts
  }, [articles])

  const filteredGuides = articles.filter((guide) => {
    const categoryMatch = !category || guide.category === category
    const difficultyMatch = !difficulty || guide.difficulty === difficulty
    return categoryMatch && difficultyMatch
  })

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  const hasFilters = Boolean(category || difficulty)

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="lz-category" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
          Category
        </label>
        <select
          id="lz-category"
          value={category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="input w-full"
        >
          <option value="">All categories ({articles.length})</option>
          {categoryOptions.map(({ name, count }) => (
            <option key={name} value={name}>
              {name} ({count})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lz-difficulty" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
          Difficulty
        </label>
        <select
          id="lz-difficulty"
          value={difficulty}
          onChange={(e) => updateFilter('difficulty', e.target.value)}
          className="input w-full"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value || 'all'} value={d.value}>
              {d.value
                ? `${d.label} (${difficultyCounts[d.value] ?? 0})`
                : `All levels (${articles.length})`}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button type="button" onClick={clearFilters} className="w-full btn-secondary text-sm">
          Clear filters
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Seo
        title="Learning Zone"
        description="Tutorials and guides on AI agents, MCP servers, LLMs, prompt engineering, and integrating AI into web apps."
        path="/learning"
      />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Zone</h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Practical guides from beginner to advanced — filter by topic and difficulty.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden card p-4 mb-6">
              <FilterPanel />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{filteredGuides.length}</span>
                {' '}
                guide{filteredGuides.length !== 1 ? 's' : ''}
                {hasFilters ? ' matching filters' : ' available'}
              </p>
              {hasFilters && (
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm">
                      {category}
                      <button type="button" onClick={() => updateFilter('category', '')} aria-label="Remove category filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {difficulty && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm capitalize">
                      {difficulty}
                      <button type="button" onClick={() => updateFilter('difficulty', '')} aria-label="Remove difficulty filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <SkeletonList count={6} />
            ) : filteredGuides.length === 0 ? (
              <div className="text-center py-12 card">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No guides match your filters.</p>
                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="btn-primary mt-4">
                    Show all guides
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                    <Link
                      key={guide.id}
                      to={`/learning/${guide.slug}`}
                      className="group card hover-lift overflow-hidden flex flex-col"
                    >
                      <ArticleCover
                        title={guide.title}
                        category={guide.category}
                        coverImageUrl={guide.cover_image_url}
                        className="h-36 sm:h-40 shrink-0"
                      />
                      <div className="flex-1 flex flex-col p-6">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="badge text-xs">{guide.category}</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded capitalize shrink-0 ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm flex-1 line-clamp-2">{guide.excerpt}</p>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-dark-700 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {guide.read_time_minutes || 10} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {(guide.view_count ?? 0).toLocaleString()} views
                          </span>
                        </div>
                        <div className="flex items-center text-primary-600 dark:text-primary-400 mt-3 group-hover:translate-x-2 transition-transform">
                          <span className="text-sm font-semibold">Read Guide</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
