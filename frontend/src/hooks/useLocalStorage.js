import { useState, useCallback } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('favoriteTools', [])

  const addFavorite = useCallback((tool) => {
    setFavorites((prev) => {
      if (prev.find((t) => t.id === tool.id)) return prev
      return [...prev, tool]
    })
  }, [setFavorites])

  const removeFavorite = useCallback((toolId) => {
    setFavorites((prev) => prev.filter((t) => t.id !== toolId))
  }, [setFavorites])

  const toggleFavorite = useCallback((tool) => {
    setFavorites((prev) => {
      const exists = prev.find((t) => t.id === tool.id)
      if (exists) {
        return prev.filter((t) => t.id !== tool.id)
      }
      return [...prev, tool]
    })
  }, [setFavorites])

  const isFavorite = useCallback((toolId) => {
    return favorites.some((t) => t.id === toolId)
  }, [favorites])

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }
}
