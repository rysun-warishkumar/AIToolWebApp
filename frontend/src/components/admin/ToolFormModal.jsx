import { useEffect, useRef, useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import FormModal from './FormModal'
import { useCategories } from '../../hooks/useQueries'
import { adminAPI, toolsAPI } from '../../services/api'
import { slug, getMediaUrl } from '../../utils/helpers'
import ToolLogo from '../tools/ToolLogo'

const empty = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  website_url: '',
  logo_url: '',
  category_id: '',
  pricing_model: 'free',
  status: 'draft',
  is_featured: false,
}

export default function ToolFormModal({ open, onClose, toolId, onSuccess }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const { data: categories = [] } = useCategories('tool')
  const isEdit = Boolean(toolId)

  useEffect(() => {
    if (!open) return
    if (!toolId) {
      setForm(empty)
      return
    }
    setLoading(true)
    toolsAPI
      .getById(toolId)
      .then((res) => {
        const t = res.data?.data ?? res.data
        setForm({
          name: t.name || '',
          slug: t.slug || '',
          short_description: t.short_description || '',
          description: t.description || '',
          website_url: t.website_url || '',
          logo_url: t.logo_url || '',
          category_id: String(t.category_id || ''),
          pricing_model: t.pricing_model || 'free',
          status: t.status || 'draft',
          is_featured: Boolean(t.is_featured),
        })
      })
      .catch(() => toast.error('Failed to load tool'))
      .finally(() => setLoading(false))
  }, [open, toolId])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminAPI.uploadMedia(file, 'tool')
      const url = res.data?.data?.url
      if (url) {
        set('logo_url', url)
        toast.success('Logo uploaded')
      }
    } catch {
      toast.error('Logo upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.slug || !form.website_url || !form.category_id) {
      toast.error('Name, slug, website URL, and category are required')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      is_featured: form.is_featured ? 1 : 0,
      logo_url: form.logo_url?.trim() || null,
    }
    try {
      if (isEdit) {
        await adminAPI.updateTool(toolId, payload)
        toast.success('Tool updated')
      } else {
        await adminAPI.createTool(payload)
        toast.success('Tool created')
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
      title={isEdit ? 'Edit Tool' : 'Add Tool'}
      subtitle="Logo appears on tool cards site-wide. Upload an image or paste a URL."
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" form="tool-form" disabled={saving || loading || uploading} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </>
      }
    >
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form id="tool-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50">
            <label className="block text-sm font-medium mb-3">Tool logo</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <ToolLogo name={form.name} logoUrl={form.logo_url} size="lg" className="!w-16 !h-16" />
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload image'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleLogoUpload} />
                  {form.logo_url && (
                    <button
                      type="button"
                      onClick={() => set('logo_url', '')}
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
                    value={form.logo_url}
                    onChange={(e) => set('logo_url', e.target.value)}
                    placeholder="https://... or /uploads/..."
                  />
                </div>
                {form.logo_url && (
                  <p className="text-xs text-gray-500 truncate">Preview: {getMediaUrl(form.logo_url)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => {
                  set('name', e.target.value)
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
            <label className="block text-sm font-medium mb-1">Full description</label>
            <textarea className="input" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website URL *</label>
              <input className="input" type="url" value={form.website_url} onChange={(e) => set('website_url', e.target.value)} required />
            </div>
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
              <label className="block text-sm font-medium mb-1">Pricing</label>
              <select className="input" value={form.pricing_model} onChange={(e) => set('pricing_model', e.target.value)}>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
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
            Featured on homepage
          </label>
        </form>
      )}
    </FormModal>
  )
}
