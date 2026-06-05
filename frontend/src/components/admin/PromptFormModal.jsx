import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormModal from './FormModal'
import { useCategories } from '../../hooks/useQueries'
import { adminAPI, promptsAPI } from '../../services/api'
import { slug } from '../../utils/helpers'

const empty = {
  title: '',
  slug: '',
  short_description: '',
  content: '',
  category_id: '',
  prompt_type: 'template',
  complexity: 'intermediate',
  status: 'draft',
  is_featured: false,
}

export default function PromptFormModal({ open, onClose, promptId, onSuccess }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { data: categories = [] } = useCategories('prompt')
  const isEdit = Boolean(promptId)

  useEffect(() => {
    if (!open) return
    if (!promptId) {
      setForm(empty)
      return
    }
    setLoading(true)
    promptsAPI
      .getById(promptId)
      .then((res) => {
        const p = res.data?.data ?? res.data
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          short_description: p.short_description || '',
          content: p.content || '',
          category_id: String(p.category_id || ''),
          prompt_type: p.prompt_type || 'template',
          complexity: p.complexity || 'intermediate',
          status: p.status || 'draft',
          is_featured: Boolean(p.is_featured),
        })
      })
      .catch(() => toast.error('Failed to load prompt'))
      .finally(() => setLoading(false))
  }, [open, promptId])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.slug || !form.content || !form.category_id) {
      toast.error('Title, slug, content, and category are required')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      is_featured: form.is_featured ? 1 : 0,
    }
    try {
      if (isEdit) {
        await adminAPI.updatePrompt(promptId, payload)
        toast.success('Prompt updated')
      } else {
        await adminAPI.createPrompt(payload)
        toast.success('Prompt created')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Prompt' : 'Add Prompt'}
      subtitle="Published prompts appear on the public prompts page."
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" form="prompt-form" disabled={saving || loading} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </>
      }
    >
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form id="prompt-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => {
                  set('title', e.target.value)
                  if (!isEdit && !form.slug) set('slug', slug(e.target.value))
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input className="input" value={form.slug} onChange={(e) => set('slug', slug(e.target.value))} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short description</label>
            <input className="input" value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prompt content *</label>
            <textarea className="input font-mono text-sm min-h-[200px]" value={form.content} onChange={(e) => set('content', e.target.value)} required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select className="input" value={form.category_id} onChange={(e) => set('category_id', e.target.value)} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Complexity</label>
              <select className="input" value={form.complexity} onChange={(e) => set('complexity', e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select className="input" value={form.prompt_type} onChange={(e) => set('prompt_type', e.target.value)}>
                <option value="template">Template</option>
                <option value="system">System</option>
                <option value="user">User</option>
                <option value="instruction">Instruction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
            Featured prompt
          </label>
        </form>
      )}
    </FormModal>
  )
}
