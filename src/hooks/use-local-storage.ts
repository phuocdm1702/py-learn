"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * Provide a stateful value synchronized with `localStorage`.
 *
 * @param key - The `localStorage` key used to read and persist the value
 * @param initialValue - Value used while loading or when no stored value exists
 * @returns A tuple: `[storedValue, setValue, isLoaded]` where `storedValue` is the current value, `setValue` updates both state and `localStorage`, and `isLoaded` is `true` after the initial read attempt completes
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        // eslint-disable-next-line
        setStoredValue(JSON.parse(item))
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
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue, isLoaded] as const
}
