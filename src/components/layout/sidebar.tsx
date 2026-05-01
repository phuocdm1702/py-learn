"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Map, CheckSquare, BookOpen,
  Beaker, Settings, Code2,
  GitBranch, TestTube2, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { defaultSettings } from "@/data/seed-data"
import type { UserSettings } from "@/types"

const navigation = [
  {
    group: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Learning",
    items: [
      { title: "Learn", href: "/learn", icon: BookOpen, badge: "New" },
      { title: "Roadmap", href: "/roadmap", icon: Map },
      { title: "Skill Checklist", href: "/checklist", icon: CheckSquare },
      { title: "Daily Log", href: "/daily-log", icon: BookOpen },
      { title: "Test Coverage", href: "/test-coverage", icon: Beaker, badge: "≥80%" },
    ],
  },
  {
    group: "Parallel Skills",
    items: [
      { title: "Git & Commits", href: "/roadmap#git", icon: GitBranch, badge: "Active" },
      { title: "Testing", href: "/roadmap#testing", icon: TestTube2, badge: "Active" },
      { title: "Clean Code", href: "/roadmap#clean", icon: Code2, badge: "Active" },
    ],
  },
  {
    group: "Account",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [settings] = useLocalStorage<UserSettings>("py_settings", defaultSettings)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-black text-sidebar-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base tracking-tight">PyLearn OS</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((group) => (
            <div key={group.group} className="mb-4">
              <p className="mb-1 px-6 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {group.group}
              </p>
              <ul>
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary border-r-2 border-sidebar-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-sidebar-primary" : "")} />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs py-0 px-1.5">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom — Profile hint */}
        <div className="border-t border-sidebar-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
              {settings.name?.charAt(0).toUpperCase() || "P"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{settings.name || "Python Learner"}</p>
              <p className="text-xs text-sidebar-foreground/50">Hardcore Mode</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
