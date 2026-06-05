import { X } from 'lucide-react'

export default function FormModal({ title, subtitle, open, onClose, children, footer, size = 'lg' }) {
  if (!open) return null

  const widthClass =
    size === 'xl' ? 'max-w-4xl' : size === 'md' ? 'max-w-lg' : 'max-w-2xl'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className={`relative w-full ${widthClass} max-h-[90vh] flex flex-col bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-dark-700 shrink-0">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
        {footer && (
          <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
