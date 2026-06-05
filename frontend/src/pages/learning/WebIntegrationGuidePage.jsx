import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function WebIntegrationGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link to="/learning" className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Zone
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Integrating AI with Your Web App
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge">Web Integration</span>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded capitalize font-semibold">
              Intermediate
            </span>
            <span className="text-gray-600 dark:text-gray-400">14 min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Integrate AI?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Adding AI capabilities to your web application can enhance user experience, automate tasks, and provide intelligent features that differentiate your product from competitors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Architecture Patterns
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Client-Side Integration</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Call AI APIs directly from your frontend. Good for simple use cases, but exposes your API keys.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Backend Integration</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Create backend endpoints that handle AI requests. More secure and allows for cost control.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Hybrid Approach</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Combine both approaches based on your requirements. Use backend for sensitive operations.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Backend Integration Example
            </h2>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`// Express backend endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body
  
  try {
    const response = await openai.messages.create({
      model: 'gpt-4',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }]
    })
    
    res.json({
      success: true,
      response: response.content[0].text
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Frontend Usage
            </h2>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`// React component
const [response, setResponse] = useState('')
const [loading, setLoading] = useState(false)

const handleChat = async (message) => {
  setLoading(true)
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    
    const data = await res.json()
    setResponse(data.response)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Best Practices
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Always store API keys securely (use environment variables)</li>
              <li>Implement rate limiting to control costs and prevent abuse</li>
              <li>Add error handling and user-friendly error messages</li>
              <li>Use caching to avoid redundant API calls</li>
              <li>Monitor API usage and set budget alerts</li>
              <li>Implement streaming for long responses to improve UX</li>
              <li>Add logging for debugging and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Real-World Use Cases
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>AI-powered search and recommendations</li>
              <li>Intelligent chatbots for customer support</li>
              <li>Content generation and editing tools</li>
              <li>Code completion and programming assistance</li>
              <li>Sentiment analysis and content moderation</li>
              <li>Personalized user experience</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Start small with a proof of concept, measure the impact, and gradually expand AI features as you gain confidence and user adoption.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
