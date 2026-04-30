"use client"

import { useState } from "react"
import { Settings, User, Monitor, Clock, CalendarDays, Palette } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { defaultSettings } from "@/data/seed-data"
import type { UserSettings } from "@/types"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("py_settings", defaultSettings)
  const [form, setForm] = useState<UserSettings>(settings)
  const [saved, setSaved] = useState(false)

  const saveSettings = () => {
    setSettings(form)
    
    // Apply theme
    if (form.theme !== settings.theme) {
      if (form.theme === "dark") {
        document.documentElement.classList.add("dark")
        localStorage.setItem("py_theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("py_theme", "light")
      }
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tùy chỉnh hồ sơ học tập và giao diện dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Hồ Sơ Người Học
            </CardTitle>
            <CardDescription>Thông tin profile để track tiến trình</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tên / Biệt danh</label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Background (Kinh nghiệm cũ)</label>
              <Input value={form.background} onChange={e => setForm(p => ({ ...p, background: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Giờ học / ngày</label>
                <Input type="number" min={1} max={12} value={form.hoursPerDay} onChange={e => setForm(p => ({ ...p, hoursPerDay: +e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-3 w-3" /> Ngày học / tuần</label>
                <Input type="number" min={1} max={7} value={form.daysPerWeek} onChange={e => setForm(p => ({ ...p, daysPerWeek: +e.target.value }))} />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={saveSettings} className="w-full sm:w-auto">
                {saved ? "Đã lưu!" : "Lưu Thay Đổi"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Appearance
            </CardTitle>
            <CardDescription>Giao diện</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div 
                className={cn("border rounded-md p-3 cursor-pointer transition-all", form.theme === "dark" ? "border-primary bg-primary/5" : "hover:bg-muted")}
                onClick={() => setForm(p => ({ ...p, theme: "dark" }))}
              >
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm font-medium">Dark Mode (Violet Slate)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">Phù hợp học code ban đêm</p>
              </div>
              <div 
                className={cn("border rounded-md p-3 cursor-pointer transition-all", form.theme === "light" ? "border-primary bg-primary/5" : "hover:bg-muted")}
                onClick={() => setForm(p => ({ ...p, theme: "light" }))}
              >
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Light Mode</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">Phù hợp ban ngày</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
