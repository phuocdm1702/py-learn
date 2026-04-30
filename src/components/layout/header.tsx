"use client"

import { Menu, Sun, Moon, Bell, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Default dark mode
    document.documentElement.classList.add("dark")
    const stored = localStorage.getItem("py_theme")
    if (stored === "light") {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("py_theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("py_theme", "light")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu toggle */}
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      {title && (
        <h1 className="hidden md:block text-base font-semibold text-foreground">{title}</h1>
      )}

      <div className="flex flex-1 items-center gap-2 justify-end">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground" id="theme-toggle">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
