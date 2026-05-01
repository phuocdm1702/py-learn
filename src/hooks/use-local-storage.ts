"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        // Handle both JSON strings and primitive values
        let parsedValue
        try {
          parsedValue = JSON.parse(item)
        } catch {
          // If JSON.parse fails, treat as primitive value
          parsedValue = item
        }
        // eslint-disable-next-line
        setStoredValue(parsedValue)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [key])

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        // Only JSON.stringify if value is not a primitive string
        const valueForStorage = typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore)
        window.localStorage.setItem(key, valueForStorage)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue, isLoaded] as const
}
