import { Link } from 'react-router-dom'

export default function LegalPageLayout({ title, subtitle, children, updated = 'June 2026' }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-primary-100 text-lg">{subtitle}</p>}
          <p className="text-primary-200 text-sm mt-4">Last updated: {updated}</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="card p-8 md:p-10 prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
          {children}
        </article>
        <p className="text-center mt-8 text-sm text-gray-500">
          Questions? <Link to="/contact" className="text-primary-600 hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  )
}
