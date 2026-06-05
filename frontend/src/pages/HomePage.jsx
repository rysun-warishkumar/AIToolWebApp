import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Sparkles, Search } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { useTools } from '../hooks/useQueries'
import { usePrompts } from '../hooks/useQueries'
import { ToolCard } from '../components/tools/ToolCard'
import { PromptCard } from '../components/tools/ToolCard'
import { SkeletonCard, SkeletonList } from '../components/common/Skeleton'

export default function HomePage() {
  const { data: tools, isLoading: toolsLoading } = useTools(1, 6, { sortBy: 'popularity_score' })
  const { data: prompts, isLoading: promptsLoading } = usePrompts(1, 6)

  return (
    <div className="w-full">
      <Seo path="/" />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4 border-b border-primary-100/80 dark:border-dark-700">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-white to-purple-50/80 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-200/70 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-purple-200/60 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-8 shadow-sm border border-primary-100 dark:border-primary-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">Discover AI-powered tools & prompts</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Find the Best AI Tools
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">and Prompt Templates</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore thousands of AI tools, compare features, and discover powerful prompts to boost your productivity
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/tools" className="btn-primary inline-flex items-center gap-2 justify-center">
              Explore Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/prompts" className="btn-secondary inline-flex items-center gap-2 justify-center">
              Browse Prompts
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Search Preview */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 dark:bg-dark-800/80 p-4 flex items-center gap-3 rounded-xl border border-gray-200/80 dark:border-dark-600 shadow-md shadow-primary-500/5 ring-1 ring-primary-100/50 dark:ring-dark-600">
              <Search className="w-5 h-5 text-primary-500" />
              <input
                type="text"
                placeholder="Search AI tools, prompts..."
                className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                disabled
              />
              <Zap className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-dark-800 dark:to-dark-900 border-y border-gray-100 dark:border-dark-700">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: '1000+', label: 'AI Tools' },
            { value: '500+', label: 'Prompts' },
            { value: '50K+', label: 'Users' },
            { value: '4.9★', label: 'Rating' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center bg-white dark:bg-dark-800 rounded-xl py-5 px-3 shadow-sm border border-gray-100 dark:border-dark-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 md:py-28 px-4 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Popular AI Tools</h2>
              <p className="text-gray-600 dark:text-gray-400">Trending tools used by thousands</p>
            </div>
            <Link to="/tools" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {toolsLoading ? (
            <SkeletonList count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools?.data?.map((tool) => (
                <ToolCard key={tool.id} tool={tool} featured={tool.is_featured} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Prompts */}
      <section className="py-20 md:py-28 px-4 bg-gray-50/80 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Trending Prompts</h2>
              <p className="text-gray-600 dark:text-gray-400">Copy & use powerful AI prompts</p>
            </div>
            <Link to="/prompts" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {promptsLoading ? (
            <SkeletonList count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts?.data?.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-400">Find tools for your specific needs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Writing', icon: '✍️', color: 'from-purple-500' },
              { name: 'Image Gen', icon: '🎨', color: 'from-pink-500' },
              { name: 'Coding', icon: '💻', color: 'from-blue-500' },
              { name: 'Data', icon: '📊', color: 'from-green-500' },
              { name: 'Voice', icon: '🎤', color: 'from-orange-500' },
              { name: 'Business', icon: '📈', color: 'from-red-500' },
              { name: 'Learning', icon: '📚', color: 'from-cyan-500' },
              { name: 'Automation', icon: '⚙️', color: 'from-indigo-500' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/tools?category=${cat.name.toLowerCase()}`}
                className="card hover-lift p-6 text-center group bg-white dark:bg-dark-800 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Start exploring AI tools and prompts today. Free forever, premium features available.
          </p>
          <Link to="/tools" className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-shadow">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
