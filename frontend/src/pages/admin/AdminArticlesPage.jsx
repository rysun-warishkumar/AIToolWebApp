import { useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAdminArticles } from '../../hooks/useQueries'
import { adminAPI } from '../../services/api'
import { getStatusBadge } from '../../utils/helpers'
import { SkeletonList } from '../../components/common/Skeleton'
import ArticleFormModal from '../../components/admin/ArticleFormModal'

export default function AdminArticlesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const queryClient = useQueryClient()

  const filters = useMemo(
    () => ({ search: search.trim() || undefined, status: statusFilter }),
    [search, statusFilter]
  )

  const { data: articles = [], isLoading, error } = useAdminArticles(filters)

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticles'] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Article archived')
    },
    onError: () => toast.error('Failed to archive article'),
  })

  const openCreate = () => {
    setEditId(null)
    setModalOpen(true)
  }

  const openEdit = (id) => {
    setEditId(id)
    setModalOpen(true)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Articles</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {articles.length} article{articles.length !== 1 ? 's' : ''} — powers the Learning Zone
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Article
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>
        <select className="input w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          Unable to load articles. Restart the backend to create the articles table.
        </div>
      )}

      {isLoading ? (
        <SkeletonList count={4} />
      ) : articles.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No articles yet. Create your first learning guide.</p>
          <button type="button" onClick={openCreate} className="btn-primary">
            Add Article
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Read time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                const badge = getStatusBadge(article.status)
                return (
                  <tr key={article.id} className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                    <td className="px-6 py-4 font-medium">{article.title}</td>
                    <td className="px-6 py-4 text-sm">{article.category}</td>
                    <td className="px-6 py-4 text-sm capitalize">{article.difficulty}</td>
                    <td className="px-6 py-4 text-sm">{article.read_time_minutes || 10} min</td>
                    <td className="px-6 py-4 text-sm">{(article.view_count ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      {article.status === 'published' && (
                        <Link
                          to={`/learning/${article.slug}`}
                          target="_blank"
                          className="p-2 inline-block hover:bg-gray-100 dark:hover:bg-dark-700 rounded mr-1"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </Link>
                      )}
                      <button type="button" onClick={() => openEdit(article.id)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded mr-2">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm(`Archive "${article.title}"?`)) return
                          deleteMutation.mutate(article.id)
                        }}
                        disabled={deleteMutation.isPending || article.status === 'archived'}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ArticleFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        articleId={editId}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['adminArticles'] })
          queryClient.invalidateQueries({ queryKey: ['articles'] })
        }}
      />
    </div>
  )
}
