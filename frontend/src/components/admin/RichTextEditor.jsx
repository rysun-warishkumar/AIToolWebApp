import { useRef, useState } from 'react'
import { Image, Code, Heading2, Bold, Eye, Edit3, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { adminAPI } from '../../services/api'
import { getMediaUrl } from '../../utils/helpers'
import MarkdownContent from '../common/MarkdownContent'

export default function RichTextEditor({ value, onChange, label = 'Content' }) {
  const textareaRef = useRef(null)
  const fileRef = useRef(null)
  const [tab, setTab] = useState('write')
  const [uploading, setUploading] = useState(false)

  const insertAtCursor = (snippet) => {
    const el = textareaRef.current
    if (!el) {
      onChange((value || '') + snippet)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = (value || '').slice(0, start) + snippet + (value || '').slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }

  const wrapSelection = (before, after = before) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = (value || '').slice(start, end)
    const snippet = `${before}${selected || 'text'}${after}`
    const next = (value || '').slice(0, start) + snippet + (value || '').slice(end)
    onChange(next)
  }

  const handleImageUrl = () => {
    const url = window.prompt('Image URL (or upload with the upload button):')
    if (url) insertAtCursor(`\n\n![Image description](${url})\n\n`)
  }

  const handleCodeBlock = () => {
    insertAtCursor('\n\n```javascript\n// Your code here\n```\n\n')
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminAPI.uploadMedia(file, 'article')
      const url = getMediaUrl(res.data.data.url)
      insertAtCursor(`\n\n![${file.name}](${url})\n\n`)
      toast.success('Image inserted')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">{label}</label>
        <div className="flex rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-3 py-1 flex items-center gap-1 ${tab === 'write' ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-dark-900'}`}
          >
            <Edit3 className="w-3 h-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-3 py-1 flex items-center gap-1 ${tab === 'preview' ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-dark-900'}`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      {tab === 'write' && (
        <>
          <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-lg bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700">
            <button type="button" title="Heading" onClick={() => insertAtCursor('\n\n## ')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700">
              <Heading2 className="w-4 h-4" />
            </button>
            <button type="button" title="Bold" onClick={() => wrapSelection('**')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700">
              <Bold className="w-4 h-4" />
            </button>
            <button type="button" title="Image URL" onClick={handleImageUrl} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700">
              <Image className="w-4 h-4" />
            </button>
            <button type="button" title="Upload image" onClick={() => fileRef.current?.click()} disabled={uploading} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700 disabled:opacity-50">
              <Upload className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button type="button" title="Code block" onClick={handleCodeBlock} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700">
              <Code className="w-4 h-4" />
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={14}
            className="input font-mono text-sm min-h-[280px]"
            placeholder="Write in Markdown. Use toolbar for headings, images, and code blocks."
          />
        </>
      )}

      {tab === 'preview' && (
        <div className="min-h-[280px] p-4 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          <MarkdownContent content={value || '*Nothing to preview yet.*'} />
        </div>
      )}
    </div>
  )
}
