"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        // Check if we should parse as JSON based on initialValue type and content
        const shouldParseAsJSON =
          typeof initialValue === 'object' && initialValue !== null ||
          Array.isArray(initialValue) ||
          (typeof initialValue !== 'string' && typeof initialValue !== 'number' && typeof initialValue !== 'boolean')

        let parsedValue: T

        if (shouldParseAsJSON && (item.startsWith('{') || item.startsWith('['))) {
          try {
            parsedValue = JSON.parse(item)
          } catch {
            // If JSON parse fails for non-string expected type, use initialValue
            parsedValue = initialValue
          }
        } else if (typeof initialValue === 'string') {
          // Preserve string values exactly as stored
          parsedValue = item as T
        } else {
          // Try parsing for non-string types, fallback to initialValue on failure
          try {
            parsedValue = JSON.parse(item)
          } catch {
            parsedValue = initialValue
          }
        }

        // eslint-disable-next-line
        setStoredValue(parsedValue)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [key, initialValue])

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        // Store based on type to preserve type semantics
        let valueForStorage: string
        if (typeof valueToStore === 'string') {
          valueForStorage = valueToStore
        } else if (typeof valueToStore === 'number' || typeof valueToStore === 'boolean') {
          // Store primitives as JSON to distinguish from strings
          valueForStorage = JSON.stringify(valueToStore)
        } else {
          // Objects and arrays always as JSON
          valueForStorage = JSON.stringify(valueToStore)
        }

        window.localStorage.setItem(key, valueForStorage)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue, isLoaded] as const
}
