import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AIAgentGuidePage() {
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
            How to Create an AI Agent
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge">AI Agents</span>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded capitalize font-semibold">
              Intermediate
            </span>
            <span className="text-gray-600 dark:text-gray-400">15 min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. In this comprehensive guide, we'll walk you through the entire process of creating your first AI agent from scratch.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What You'll Learn
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Core concepts of AI agents</li>
              <li>Agent architecture and design patterns</li>
              <li>Building blocks: perception, reasoning, and action</li>
              <li>Practical implementation with popular frameworks</li>
              <li>Testing and deployment strategies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Prerequisites
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Basic understanding of Python or JavaScript</li>
              <li>Familiarity with APIs and HTTP requests</li>
              <li>Knowledge of machine learning fundamentals</li>
              <li>Installed Python 3.8+ or Node.js 16+</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Step 1: Understanding Agent Architecture
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              An AI agent typically consists of three main components:
            </p>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 mb-4 border border-gray-200 dark:border-dark-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">1. Perception Module</p>
              <p className="text-gray-700 dark:text-gray-300">
                Gathers data from the environment and processes it into actionable information.
              </p>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 mb-4 border border-gray-200 dark:border-dark-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">2. Decision Engine</p>
              <p className="text-gray-700 dark:text-gray-300">
                Analyzes perceived data and makes decisions using logic, machine learning, or neural networks.
              </p>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">3. Action Module</p>
              <p className="text-gray-700 dark:text-gray-300">
                Executes decisions by interacting with the environment or external systems.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Step 2: Setting Up Your Development Environment
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Create a new Python project with the necessary dependencies:
            </p>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`# Create project directory
mkdir ai-agent-project
cd ai-agent-project

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install openai langchain python-dotenv requests`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Conclusion
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Congratulations! You now have the foundation to build sophisticated AI agents. Start with simple agents and gradually increase complexity as you become more comfortable with the concepts and tools.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Have questions or suggestions? Please open an issue on our GitHub repository or reach out to our community.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
