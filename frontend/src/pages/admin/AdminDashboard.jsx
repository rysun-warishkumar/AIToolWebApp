import { Link } from 'react-router-dom'
import { Wrench, BookMarked } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdminDashboard } from '../../hooks/useQueries'
import { formatRelativeDate } from '../../utils/helpers'

const formatCount = (n) => (n ?? 0).toLocaleString()
import { SkeletonList } from '../../components/common/Skeleton'

export default function AdminDashboard() {
  const { admin } = useAuth()
  const { data, isLoading, error } = useAdminDashboard()

  const stats = data?.stats
  const recentActivity = data?.recent_activity || []

  const statCards = stats
    ? [
        { label: 'Total Tools', value: formatCount(stats.tools), icon: '🛠️' },
        { label: 'Total Prompts', value: formatCount(stats.prompts), icon: '📝' },
        {
          label: 'Published (site)',
          value: formatCount((stats.published_tools || 0) + (stats.published_prompts || 0)),
          icon: '🌐',
        },
        { label: 'Featured Items', value: formatCount(stats.featured), icon: '⭐' },
        { label: 'Tool Views', value: formatCount(stats.total_views), icon: '👁️' },
        { label: 'Prompt Copies', value: formatCount(stats.total_copies), icon: '📋' },
      ]
    : []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {admin?.name || 'Admin'}!</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Live stats from your database — same data that powers the public site.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          Unable to load dashboard stats. Check that the API is running.
        </div>
      )}

      {isLoading ? (
        <SkeletonList count={4} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {statCards.map((stat, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/admin/tools"
                className="card hover-lift p-6 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold group-hover:text-primary-600">Manage Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats?.tools ?? 0} tools in database
                  </p>
                </div>
                <Wrench className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
              </Link>

              <Link
                to="/admin/prompts"
                className="card hover-lift p-6 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold group-hover:text-primary-600">Manage Prompts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats?.prompts ?? 0} prompts in database
                  </p>
                </div>
                <BookMarked className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
            <div className="card overflow-hidden">
              {recentActivity.length === 0 ? (
                <p className="p-6 text-gray-600 dark:text-gray-400">No activity yet.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((item) => (
                      <tr
                        key={`${item.item_type}-${item.id}`}
                        className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50"
                      >
                        <td className="px-6 py-4 text-sm capitalize">{item.item_type}</td>
                        <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-dark-700">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatRelativeDate(item.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
