import { useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAdminPrompts } from '../../hooks/useQueries'
import { adminAPI } from '../../services/api'
import { getStatusBadge } from '../../utils/helpers'
import { SkeletonList } from '../../components/common/Skeleton'
import PromptFormModal from '../../components/admin/PromptFormModal'

export default function AdminPromptsPage() {
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

  const { data: prompts = [], isLoading, error } = useAdminPrompts(filters)

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPrompts'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      toast.success('Prompt archived')
    },
    onError: () => toast.error('Failed to archive prompt'),
  })

  const handleDelete = (prompt) => {
    if (!window.confirm(`Archive "${prompt.title}"? It will be hidden from the public site.`)) return
    deleteMutation.mutate(prompt.id)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Prompts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} — synced with public /prompts listing
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
          Add Prompt
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search prompts..."
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
          Unable to load prompts from API.
        </div>
      )}

      {isLoading ? (
        <SkeletonList count={5} />
      ) : prompts.length === 0 ? (
        <div className="card p-8 text-center text-gray-600 dark:text-gray-400">No prompts match your filters.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                <th className="px-6 py-4 text-left text-sm font-semibold">Prompt Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Copies</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Featured</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => {
                const badge = getStatusBadge(prompt.status)
                return (
                  <tr
                    key={prompt.id}
                    className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50"
                  >
                    <td className="px-6 py-4 font-medium">{prompt.title}</td>
                    <td className="px-6 py-4 text-sm">{prompt.category_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{(prompt.copy_count ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{prompt.is_featured ? 'Yes' : '—'}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(prompt.id)
                          setModalOpen(true)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors mr-2"
                        title="Edit prompt"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prompt)}
                        disabled={deleteMutation.isPending || prompt.status === 'archived'}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-40"
                        title="Archive prompt"
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

      <PromptFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        promptId={editId}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['adminPrompts'] })
          queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
          queryClient.invalidateQueries({ queryKey: ['prompts'] })
        }}
      />
    </div>
  )
}
