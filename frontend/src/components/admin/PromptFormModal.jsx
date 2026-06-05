import { useEffect, useRef, useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import FormModal from './FormModal'
import { useCategories } from '../../hooks/useQueries'
import { adminAPI, promptsAPI } from '../../services/api'
import { slug, getMediaUrl } from '../../utils/helpers'
import PromptExampleImage from '../prompts/PromptExampleImage'

const empty = {
  title: '',
  slug: '',
  short_description: '',
  content: '',
  example_image_url: '',
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
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
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
          example_image_url: p.example_image_url || '',
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminAPI.uploadMedia(file, 'prompt')
      const url = res.data?.data?.url
      if (url) {
        set('example_image_url', url)
        toast.success('Example image uploaded')
      }
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

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
      example_image_url: form.example_image_url?.trim() || null,
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
      subtitle="Optional example output image appears on prompt cards when set."
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" form="prompt-form" disabled={saving || loading || uploading} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </>
      }
    >
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form id="prompt-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50">
            <label className="block text-sm font-medium mb-3">Example output image</label>
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-dark-600 mb-4">
              <PromptExampleImage
                title={form.title}
                imageUrl={form.example_image_url}
                variant="card"
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload image'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              {form.example_image_url && (
                <button
                  type="button"
                  onClick={() => set('example_image_url', '')}
                  className="btn-secondary text-sm flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Or paste image URL</label>
              <input
                className="input text-sm"
                type="url"
                value={form.example_image_url}
                onChange={(e) => set('example_image_url', e.target.value)}
                placeholder="https://... or /uploads/..."
              />
            </div>
            {form.example_image_url && (
              <p className="text-xs text-gray-500 truncate mt-2">Preview: {getMediaUrl(form.example_image_url)}</p>
            )}
          </div>

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
