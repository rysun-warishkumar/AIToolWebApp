import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toolsAPI, promptsAPI, categoriesAPI, tagsAPI, featuredAPI, adminAPI, articlesAPI } from '../services/api'
import { normalizeListResponse } from '../utils/helpers'

// Tools
export const useTools = (page = 1, perPage = 12, filters = {}) => {
  return useQuery({
    queryKey: ['tools', page, perPage, filters],
    queryFn: () => toolsAPI.list({ page, perPage, ...filters }),
    select: (res) => res.data,
  })
}

export const useTool = (id) => {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: () => toolsAPI.getById(id),
    select: (res) => res.data?.data ?? res.data,
    enabled: !!id,
  })
}

export const useToolSearch = (query, page = 1) => {
  return useQuery({
    queryKey: ['toolSearch', query, page],
    queryFn: () => toolsAPI.search(query, { page }),
    select: (res) => res.data,
    enabled: query?.length >= 2,
  })
}

// Prompts
export const usePrompts = (page = 1, perPage = 12, filters = {}) => {
  return useQuery({
    queryKey: ['prompts', page, perPage, filters],
    queryFn: () => promptsAPI.list({ page, perPage, ...filters }),
    select: (res) => res.data,
  })
}

export const usePrompt = (id) => {
  return useQuery({
    queryKey: ['prompt', id],
    queryFn: () => promptsAPI.getById(id),
    select: (res) => res.data?.data ?? res.data,
    enabled: !!id,
  })
}

export const usePromptSearch = (query, page = 1) => {
  return useQuery({
    queryKey: ['promptSearch', query, page],
    queryFn: () => promptsAPI.search(query, { page }),
    select: (res) => res.data,
    enabled: query?.length >= 2,
  })
}

// Categories
export const useCategories = (type = 'tool') => {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => categoriesAPI.list(type),
    select: (res) => normalizeListResponse(res),
  })
}

// Tags
export const useTags = (page = 1, perPage = 50) => {
  return useQuery({
    queryKey: ['tags', page, perPage],
    queryFn: () => tagsAPI.list({ page, perPage }),
    select: (res) => res.data,
  })
}

export const usePopularTags = (limit = 20) => {
  return useQuery({
    queryKey: ['popularTags', limit],
    queryFn: () => tagsAPI.popular(limit),
    select: (res) => res.data.data,
  })
}

// Featured
export const useFeaturedItems = (collection = null, type = null) => {
  return useQuery({
    queryKey: ['featured', collection, type],
    queryFn: () => featuredAPI.list({ collection, type }),
    select: (res) => res.data.data,
  })
}

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: ['featuredCollections'],
    queryFn: () => featuredAPI.collections(),
    select: (res) => res.data.data,
  })
}

// Admin
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminAPI.dashboard(),
    select: (res) => res.data,
  })
}

export const useAdminTools = (filters = {}) => {
  return useQuery({
    queryKey: ['adminTools', filters],
    queryFn: () => adminAPI.listTools(filters),
    select: (res) => res.data.data,
  })
}

export const useAdminPrompts = (filters = {}) => {
  return useQuery({
    queryKey: ['adminPrompts', filters],
    queryFn: () => adminAPI.listPrompts(filters),
    select: (res) => res.data.data,
  })
}

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesAPI.list(),
    select: (res) => res.data.data ?? [],
  })
}

export const useArticle = (slug) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articlesAPI.getBySlug(slug),
    select: (res) => res.data.data,
    enabled: !!slug,
  })
}

export const useAdminArticles = (filters = {}) => {
  return useQuery({
    queryKey: ['adminArticles', filters],
    queryFn: () => adminAPI.listArticles(filters),
    select: (res) => res.data.data ?? [],
  })
}
