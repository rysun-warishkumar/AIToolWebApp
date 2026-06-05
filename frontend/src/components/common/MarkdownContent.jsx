import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getMediaUrl } from '../../utils/helpers'

export default function MarkdownContent({ content, className = '' }) {
  return (
    <div className={`article-markdown prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => (
            <img src={getMediaUrl(src)} alt={alt || ''} className="rounded-lg max-w-full my-4" loading="lazy" />
          ),
          code: ({ inline, className: codeClass, children, ...props }) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-700 text-sm" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
                <code className={codeClass} {...props}>
                  {children}
                </code>
              </pre>
            )
          },
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  )
}
