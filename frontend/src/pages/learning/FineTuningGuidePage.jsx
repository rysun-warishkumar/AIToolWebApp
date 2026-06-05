import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FineTuningGuidePage() {
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
            Fine-Tuning Language Models
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge">Advanced AI</span>
            <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded capitalize font-semibold">
              Advanced
            </span>
            <span className="text-gray-600 dark:text-gray-400">16 min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is Fine-Tuning?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Fine-tuning is the process of adapting a pre-trained language model to your specific domain or task. Instead of training from scratch, you leverage an existing model's knowledge and adjust it with your custom data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              When to Fine-Tune
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">✅ Good Candidates</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Specialized domain language (medical, legal, technical)</li>
                  <li>Specific output format requirements</li>
                  <li>Cost optimization for high-volume use</li>
                  <li>Proprietary knowledge integration</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">❌ Not Recommended</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>General-purpose tasks (use prompting instead)</li>
                  <li>Very small datasets (&lt;100 examples)</li>
                  <li>Rapidly changing domain</li>
                  <li>Limited computational resources</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Fine-Tuning Approaches
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li><strong>Full Fine-Tuning:</strong> Train all model parameters (expensive, most effective)</li>
              <li><strong>Parameter-Efficient Fine-Tuning:</strong> LoRA, QLoRA - train only small adapters</li>
              <li><strong>Prompt Fine-Tuning:</strong> Learn task-specific prefixes (lightweight)</li>
              <li><strong>Instruction Fine-Tuning:</strong> Teach the model to follow new instructions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Preparing Your Data
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Format</h3>
                <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre><code>{`[
  {
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "What is AI?" },
      { "role": "assistant", "content": "AI is..." }
    ]
  },
  ...
]`}</code></pre>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-4">Key considerations:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>At least 50-100 examples for reasonable results</li>
                  <li>1000+ examples for significant improvements</li>
                  <li>Diverse, high-quality examples</li>
                  <li>Balanced distribution of scenarios</li>
                  <li>Remove duplicates and low-quality samples</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Fine-Tuning with OpenAI
            </h2>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`# Prepare your data file
openai tools fine_tunes.prepare_data -f data.jsonl

# Create fine-tuning job
openai api fine_tunes.create \\
  -t prepared_data_train.jsonl \\
  -v prepared_data_valid.jsonl \\
  -m gpt-3.5-turbo \\
  -n 3

# Monitor progress
openai api fine_tunes.follow -i ft-xxx

# Use your fine-tuned model
openai api completions.create \\
  -m ft-xxx \\
  -p "Your prompt here"`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cost Considerations
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Training Cost:</span> Typically 3-5x the cost of standard API calls per token. GPT-3.5 fine-tuning: ~$0.03 per 1K tokens.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Usage Cost:</span> Inference is typically cheaper than training but slightly more expensive than base model.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Evaluation and Iteration
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Start with a small number of training epochs (3-5)</li>
              <li>Use a validation set to monitor performance</li>
              <li>Compare with the base model and prompting approaches</li>
              <li>Iterate on data quality and quantity</li>
              <li>Monitor for overfitting (especially with small datasets)</li>
              <li>Track metrics relevant to your use case</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Fine-tuning is a powerful technique but requires careful planning and data curation. Start with a small proof-of-concept before committing significant resources.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
