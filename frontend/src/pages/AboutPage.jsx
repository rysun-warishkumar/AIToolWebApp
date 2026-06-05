import { Link } from 'react-router-dom'
import { Sparkles, Target, Users, Zap } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { PAGE_SEO } from '../config/seo'

const values = [
  { icon: Target, title: 'Curated quality', desc: 'Every tool and prompt is reviewed so you spend less time searching and more time building.' },
  { icon: Zap, title: 'Stay current', desc: 'The AI landscape moves fast — we keep listings fresh and highlight what actually works.' },
  { icon: Users, title: 'Built for builders', desc: 'Whether you are a developer, marketer, or student, find resources matched to your workflow.' },
  { icon: Sparkles, title: 'Learn as you go', desc: 'Our Learning Zone turns complex topics into practical guides you can apply today.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Seo
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        path="/about"
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white py-20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-6">About AI Tools Library</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your hub for AI tools, prompts & practical learning
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We help creators and teams discover trustworthy AI resources and level up with hands-on guides — all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        <div className="card p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            AI Tools Library was created to cut through the noise. Instead of endless bookmark lists and outdated roundups,
            we offer a structured directory of tools and prompts, plus a Learning Zone where you can go deep on agents,
            MCP servers, prompt engineering, and more.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What we stand for</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 flex gap-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-dark-800 border-y border-gray-200 dark:border-dark-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to collaborate?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Submit a tool, suggest a guide topic, or partner with us — we would love to hear from you.
          </p>
          <Link to="/contact" className="btn-primary inline-flex">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}
