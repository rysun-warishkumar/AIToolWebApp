import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MCPServerGuidePage() {
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
            How to Configure an MCP Server
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge">Integration</span>
            <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded capitalize font-semibold">
              Advanced
            </span>
            <span className="text-gray-600 dark:text-gray-400">12 min read</span>
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
              The Model Context Protocol (MCP) is a powerful framework for building extensible applications that can interact with AI models. This guide covers everything you need to know to set up and configure an MCP server for your use case.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is MCP?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              The Model Context Protocol provides a standardized way to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Connect AI models to external tools and data sources</li>
              <li>Define capabilities and resources</li>
              <li>Handle client-server communication efficiently</li>
              <li>Implement complex AI workflows</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Prerequisites
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Node.js 16 or higher</li>
              <li>Understanding of asynchronous programming</li>
              <li>Familiarity with REST APIs</li>
              <li>Basic knowledge of JSON and serialization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Setting Up Your First MCP Server
            </h2>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Create a new MCP server project
mkdir my-mcp-server
cd my-mcp-server
npm init -y

# Add TypeScript (optional but recommended)
npm install -D typescript ts-node @types/node`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Basic Server Implementation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Here's a minimal MCP server that exposes a simple tool:
            </p>
            <div className="bg-dark-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
              <pre><code>{`import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server({
  name: 'example-server',
  version: '1.0.0'
})

// Define a simple tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'greet') {
    return {
      content: [{
        type: 'text',
        text: \`Hello, \${request.params.arguments?.name || 'World'}!\`
      }]
    }
  }
  return { content: [{ type: 'text', text: 'Unknown tool' }] }
})

// Start the server
const transport = new StdioServerTransport()
await server.connect(transport)`}</code></pre>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Best Practices
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Error Handling</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Always handle errors gracefully and provide meaningful error messages to clients.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Performance</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Implement caching and optimize long-running operations to ensure responsive interactions.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Security</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Validate all inputs, use authentication tokens, and restrict access to sensitive operations.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Ready to build your own MCP server? Start with a simple example and gradually add more tools and capabilities as you gain experience.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
