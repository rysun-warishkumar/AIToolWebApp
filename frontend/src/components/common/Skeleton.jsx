export const SkeletonCard = () => (
  <div className="card p-4 space-y-4">
    <div className="w-12 h-12 bg-gray-300 dark:bg-dark-700 rounded-lg animate-shimmer"></div>
    <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded animate-shimmer w-3/4"></div>
    <div className="h-3 bg-gray-300 dark:bg-dark-700 rounded animate-shimmer"></div>
    <div className="h-3 bg-gray-300 dark:bg-dark-700 rounded animate-shimmer w-5/6"></div>
    <div className="flex gap-2 pt-2">
      <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded-full animate-shimmer flex-1"></div>
      <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded-full animate-shimmer flex-1"></div>
    </div>
  </div>
)

export const SkeletonList = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export const SkeletonDetailPage = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="space-y-4">
      <div className="h-12 w-2/3 bg-gray-300 dark:bg-dark-700 rounded animate-shimmer"></div>
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-dark-700 rounded animate-shimmer"></div>
    </div>

    {/* Content */}
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-300 dark:bg-dark-700 rounded animate-shimmer"></div>
      ))}
    </div>
  </div>
)
