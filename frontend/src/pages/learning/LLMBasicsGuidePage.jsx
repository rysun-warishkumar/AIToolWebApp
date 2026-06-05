import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LLMBasicsGuidePage() {
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
            Getting Started with LLMs
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge">Fundamentals</span>
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded capitalize font-semibold">
              Beginner
            </span>
            <span className="text-gray-600 dark:text-gray-400">8 min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What are Large Language Models?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Large Language Models (LLMs) are neural networks trained on vast amounts of text data to understand and generate human-like text. They power applications like ChatGPT, Claude, and many other AI tools you use today.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Key Concepts
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Tokens</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Tokens are the building blocks of language models. One token ≈ 4 characters. Understanding token counts helps you estimate costs and manage context windows.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Context Window</p>
                <p className="text-gray-700 dark:text-gray-300">
                  The context window is the maximum amount of text (in tokens) that an LLM can process at once. Modern models can handle 4K to 200K+ tokens.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Temperature</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Temperature controls randomness in model responses. Lower values (0-0.3) make outputs deterministic, higher values (0.7-1.0) make them more creative.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Getting Started
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Choose an LLM provider (OpenAI, Anthropic, Hugging Face, etc.)</li>
              <li>Sign up and get an API key</li>
              <li>Install the appropriate SDK for your language</li>
              <li>Start with simple prompts and iterate</li>
              <li>Monitor token usage and costs</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              First API Call
            </h2>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`import { OpenAI } from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function main() {
  const message = await client.messages.create({
    model: 'gpt-4',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: 'Hello! What is AI?' }
    ]
  })
  console.log(message.content[0].text)
}

main()`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Common Use Cases
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Content generation and summarization</li>
              <li>Question answering and research assistance</li>
              <li>Code generation and debugging</li>
              <li>Customer service and chatbots</li>
              <li>Translation and language transformation</li>
              <li>Data analysis and insights</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Start experimenting with LLMs today. The best way to learn is by hands-on practice and exploration.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
