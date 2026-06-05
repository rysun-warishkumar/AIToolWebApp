import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Public API endpoints
export const toolsAPI = {
  list: (params) => api.get('/tools', { params }),
  getById: (id) => api.get(`/tools/${id}`),
  recordView: (id) => api.post(`/tools/${id}/view`),
  search: (query, params) => api.get('/tools/search', { params: { q: query, ...params } }),
}

export const promptsAPI = {
  list: (params) => api.get('/prompts', { params }),
  getById: (id) => api.get(`/prompts/${id}`),
  search: (query, params) => api.get('/prompts/search', { params: { q: query, ...params } }),
  incrementCopy: (id) => api.post(`/prompts/${id}/copy`),
}

export const categoriesAPI = {
  list: (type = 'tool') => api.get('/categories', { params: { type } }),
  getById: (id, type = 'tool') => api.get(`/categories/${id}`, { params: { type } }),
}

export const tagsAPI = {
  list: (params) => api.get('/tags', { params }),
  popular: (limit = 20) => api.get('/tags/popular', { params: { limit } }),
}

export const featuredAPI = {
  list: (params) => api.get('/featured', { params }),
  collections: () => api.get('/featured/collections'),
}

export const articlesAPI = {
  list: () => api.get('/articles'),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  recordView: (slug) => api.post(`/articles/${slug}/view`),
}

// Admin API endpoints
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  me: () => api.get('/admin/me'),
  dashboard: () => api.get('/admin/dashboard'),
  listTools: (params) => api.get('/admin/tools', { params }),
  listPrompts: (params) => api.get('/admin/prompts', { params }),
  listArticles: (params) => api.get('/admin/articles', { params }),
  getArticle: (id) => api.get(`/admin/articles/${id}`),

  // Tools
  createTool: (data) => api.post('/admin/tools', data),
  updateTool: (id, data) => api.put(`/admin/tools/${id}`, data),
  deleteTool: (id) => api.delete(`/admin/tools/${id}`),
  restoreTool: (id) => api.post(`/admin/tools/${id}/restore`),
  
  // Prompts
  createPrompt: (data) => api.post('/admin/prompts', data),
  updatePrompt: (id, data) => api.put(`/admin/prompts/${id}`, data),
  deletePrompt: (id) => api.delete(`/admin/prompts/${id}`),

  createArticle: (data) => api.post('/admin/articles', data),
  updateArticle: (id, data) => api.put(`/admin/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/admin/articles/${id}`),
  
  // Categories
  createCategory: (type, data) => api.post(`/admin/categories/${type}`, data),
  updateCategory: (id, type, data) => api.put(`/admin/categories/${id}/${type}`, data),
  
  // Media
  uploadMedia: (file, entityType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entity_type', entityType)
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
