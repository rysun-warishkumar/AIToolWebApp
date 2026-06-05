import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Eye } from 'lucide-react'
import { useArticle } from '../hooks/useQueries'
import MarkdownContent from '../components/common/MarkdownContent'
import { getMediaUrl } from '../utils/helpers'
import { SkeletonDetailPage } from '../components/common/Skeleton'
import { articlesAPI } from '../services/api'
import { recordOncePerSession } from '../utils/analytics'
import Seo from '../components/seo/Seo'
import { SITE } from '../config/site'

export default function LearningArticlePage() {
  const { slug } = useParams()
  const { data: article, isLoading, error } = useArticle(slug)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    if (article) setViewCount(article.view_count ?? 0)
  }, [article])

  useEffect(() => {
    if (!slug) return
    recordOncePerSession(`article-view-${slug}`, () =>
      articlesAPI.recordView(slug).then((res) => {
        if (res.data?.view_count != null) setViewCount(res.data.view_count)
      })
    )
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-8">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <SkeletonDetailPage />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4">
        <Seo title="Article not found" noindex path={`/learning/${slug}`} />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link to="/learning" className="text-primary-600 hover:underline">
            Back to Learning Zone
          </Link>
        </div>
      </div>
    )
  }

  const difficultyClass = {
    beginner: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    intermediate: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    advanced: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  }[article.difficulty] || 'bg-gray-100'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    timeRequired: `PT${article.read_time_minutes || 10}M`,
    articleSection: article.category,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Seo
        title={article.title}
        description={article.excerpt || `${article.title} — ${SITE.tagline}`}
        path={`/learning/${article.slug}`}
        type="article"
        jsonLd={articleJsonLd}
      />

      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link to="/learning" className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Zone
          </Link>
          {article.cover_image_url && (
            <img
              src={getMediaUrl(article.cover_image_url)}
              alt=""
              className="w-full h-48 object-cover rounded-xl mb-6"
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{article.title}</h1>
          {article.excerpt && <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>}
          <div className="flex flex-wrap gap-3 text-sm items-center">
            <span className="badge">{article.category}</span>
            <span className={`px-3 py-1 rounded capitalize font-semibold ${difficultyClass}`}>{article.difficulty}</span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              {article.read_time_minutes || 10} min read
            </span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Eye className="w-4 h-4" />
              {viewCount.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <MarkdownContent content={article.content} />
      </div>
    </div>
  )
}
