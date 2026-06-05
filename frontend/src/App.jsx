import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import { AppChrome } from './components/layout/AppChrome'
import { ScrollToTop } from './components/common/ScrollToTop'

// Pages - Public
import HomePage from './pages/HomePage'
import ToolsPage from './pages/ToolsPage'
import ToolDetailPage from './pages/ToolDetailPage'
import PromptsPage from './pages/PromptsPage'
import PromptDetailPage from './pages/PromptDetailPage'
import LearningZonePage from './pages/LearningZonePage'
import LearningArticlePage from './pages/LearningArticlePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import CookiePolicyPage from './pages/CookiePolicyPage'

// Pages - Admin
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminToolsPage from './pages/admin/AdminToolsPage'
import AdminPromptsPage from './pages/admin/AdminPromptsPage'
import AdminArticlesPage from './pages/admin/AdminArticlesPage'
import AdminLayout from './components/admin/AdminLayout'

import ProtectedRoute from './utils/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AppChrome>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/tools/:id" element={<ToolDetailPage />} />
                <Route path="/prompts" element={<PromptsPage />} />
                <Route path="/prompts/:id" element={<PromptDetailPage />} />
                <Route path="/learning" element={<LearningZonePage />} />
                <Route path="/learning/:slug" element={<LearningArticlePage />} />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />

                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="tools" element={<AdminToolsPage />} />
                  <Route path="prompts" element={<AdminPromptsPage />} />
                  <Route path="articles" element={<AdminArticlesPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppChrome>

            <Toaster position="bottom-right" />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
