import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormModal from './FormModal'
import RichTextEditor from './RichTextEditor'
import { adminAPI } from '../../services/api'
import { slug } from '../../utils/helpers'

const empty = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Fundamentals',
  difficulty: 'beginner',
  read_time_minutes: 10,
  cover_image_url: '',
  status: 'draft',
  display_order: 0,
}

const ARTICLE_CATEGORIES = [
  'AI Agents',
  'Integration',
  'Fundamentals',
  'Prompting',
  'Web Integration',
  'Advanced AI',
  'General',
]

export default function ArticleFormModal({ open, onClose, articleId, onSuccess }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(articleId)

  useEffect(() => {
    if (!open) return
    if (!articleId) {
      setForm(empty)
      return
    }
    setLoading(true)
    adminAPI
      .getArticle(articleId)
      .then((res) => {
        const a = res.data.data
        setForm({
          title: a.title || '',
          slug: a.slug || '',
          excerpt: a.excerpt || '',
          content: a.content || '',
          category: a.category || 'General',
          difficulty: a.difficulty || 'beginner',
          read_time_minutes: a.read_time_minutes || 10,
          cover_image_url: a.cover_image_url || '',
          status: a.status || 'draft',
          display_order: a.display_order || 0,
        })
      })
      .catch(() => toast.error('Failed to load article'))
      .finally(() => setLoading(false))
  }, [open, articleId])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.slug || !form.content) {
      toast.error('Title, slug, and content are required')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      read_time_minutes: Number(form.read_time_minutes) || 10,
      display_order: Number(form.display_order) || 0,
    }
    try {
      if (isEdit) {
        await adminAPI.updateArticle(articleId, payload)
        toast.success('Article updated')
      } else {
        await adminAPI.createArticle(payload)
        toast.success('Article created')
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
      title={isEdit ? 'Edit Article' : 'Add Learning Article'}
      subtitle="Use the editor toolbar to insert images and code blocks (Markdown)."
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" form="article-form" disabled={saving || loading} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </>
      }
    >
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form id="article-form" onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium mb-1">Slug * (URL: /learning/slug)</label>
              <input className="input" value={form.slug} onChange={(e) => set('slug', slug(e.target.value))} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea className="input" rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select className="input" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Read time (minutes)</label>
              <input
                type="number"
                min={1}
                className="input"
                value={form.read_time_minutes}
                onChange={(e) => set('read_time_minutes', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display order</label>
              <input type="number" className="input" value={form.display_order} onChange={(e) => set('display_order', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover image URL</label>
              <input className="input" value={form.cover_image_url} onChange={(e) => set('cover_image_url', e.target.value)} placeholder="Optional hero image" />
            </div>
          </div>
          <RichTextEditor label="Article body *" value={form.content} onChange={(v) => set('content', v)} />
        </form>
      )}
    </FormModal>
  )
}
