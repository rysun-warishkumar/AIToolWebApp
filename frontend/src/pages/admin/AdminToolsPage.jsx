import { useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAdminTools } from '../../hooks/useQueries'
import { adminAPI } from '../../services/api'
import { getStatusBadge } from '../../utils/helpers'
import { SkeletonList } from '../../components/common/Skeleton'
import ToolFormModal from '../../components/admin/ToolFormModal'
import ToolLogo from '../../components/tools/ToolLogo'

export default function AdminToolsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const queryClient = useQueryClient()

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: statusFilter,
    }),
    [search, statusFilter]
  )

  const { data: tools = [], isLoading, error } = useAdminTools(filters)

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteTool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTools'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      toast.success('Tool archived')
    },
    onError: () => toast.error('Failed to archive tool'),
  })

  const handleDelete = (tool) => {
    if (!window.confirm(`Archive "${tool.name}"? It will be hidden from the public site.`)) return
    deleteMutation.mutate(tool.id)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {tools.length} tool{tools.length !== 1 ? 's' : ''} — synced with public /tools listing
          </p>
        </div>
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setEditId(null)
            setModalOpen(true)
          }}
        >
          <Plus className="w-5 h-5" />
          Add Tool
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>
        <select
          className="input w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          Unable to load tools from API.
        </div>
      )}

      {isLoading ? (
        <SkeletonList count={5} />
      ) : tools.length === 0 ? (
        <div className="card p-8 text-center text-gray-600 dark:text-gray-400">No tools match your filters.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                <th className="px-6 py-4 text-left text-sm font-semibold">Tool Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Featured</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => {
                const badge = getStatusBadge(tool.status)
                return (
                  <tr
                    key={tool.id}
                    className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 font-medium">
                        <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="sm" />
                        <span>{tool.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{tool.category_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{(tool.view_count ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{tool.is_featured ? 'Yes' : '—'}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(tool.id)
                          setModalOpen(true)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors mr-2"
                        title="Edit tool"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(tool)}
                        disabled={deleteMutation.isPending || tool.status === 'archived'}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-40"
                        title="Archive tool"
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

      <ToolFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        toolId={editId}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['adminTools'] })
          queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
          queryClient.invalidateQueries({ queryKey: ['tools'] })
        }}
      />
    </div>
  )
}
