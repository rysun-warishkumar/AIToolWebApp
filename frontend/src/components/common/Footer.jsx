import { Link } from 'react-router-dom'
import { Twitter, Github, Linkedin } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="font-bold text-lg">AI Tools</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Discover and share the best AI tools and prompts
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tools" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Tools</Link></li>
              <li><Link to="/prompts" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Prompts</Link></li>
              <li><Link to="/learning" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Learning Zone</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-primary-600 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-primary-600 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-primary-600 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-dark-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} AI Tools Library. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-600">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-primary-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
