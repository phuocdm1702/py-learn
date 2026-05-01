"use client"

import { useEffect, useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"

export type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setThemeStored] = useLocalStorage<Theme>("py_theme", "dark")

  // Apply theme to document
  useEffect(() => {
    const isDark = theme === "dark"
    document.documentElement.classList.toggle("dark", isDark)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeStored(newTheme)
  }, [setThemeStored])

  const toggleTheme = useCallback(() => {
    setThemeStored(prev => prev === "dark" ? "light" : "dark")
  }, [setThemeStored])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark"
  }
}
