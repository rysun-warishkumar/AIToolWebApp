import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PromptEngineeringGuidePage() {
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
            Prompt Engineering Best Practices
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge">Prompting</span>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded capitalize font-semibold">
              Intermediate
            </span>
            <span className="text-gray-600 dark:text-gray-400">10 min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is Prompt Engineering?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Prompt engineering is the art and science of crafting effective prompts to get the best results from language models. Well-engineered prompts lead to higher quality outputs, better accuracy, and more reliable results.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Core Principles
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">1. Be Specific</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Vague prompts lead to vague results. Include details about what you want, the format, and any constraints.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">2. Provide Context</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Background information helps the model understand your intent better and produce more relevant responses.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">3. Give Examples</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Few-shot examples (showing 2-5 examples) significantly improve model performance on complex tasks.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Prompt Engineering Techniques
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Chain of Thought:</strong> Ask the model to explain its reasoning step-by-step</li>
              <li><strong>Role-Based:</strong> Tell the model to act as a specific expert or character</li>
              <li><strong>System Prompts:</strong> Set the model's behavior with system-level instructions</li>
              <li><strong>Iterative Refinement:</strong> Start simple and progressively add details</li>
              <li><strong>Structured Output:</strong> Request specific formats like JSON or markdown</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Example: Writing Better Prompts
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">❌ Poor Prompt</h3>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">Write me a story</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ Good Prompt</h3>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                    Write a 300-word sci-fi story set in 2050 about an AI discovering its purpose. Use simple language and include dialogue between at least two characters.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Tips
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Use delimiters (###, ---, """) to separate different parts of your prompt</li>
              <li>Specify output length and format explicitly</li>
              <li>Use negative prompting ("Don't mention...") when necessary</li>
              <li>Test multiple variations and compare results</li>
              <li>Document what works and create a prompt library</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Prompt engineering is an iterative process. Experiment, measure results, and continuously improve your prompts for better outcomes.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
