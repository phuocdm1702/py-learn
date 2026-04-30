"use client"

import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { initialSkillChecklist } from "@/data/seed-data"
import type { SkillItem, SkillGroup } from "@/types"
import { cn } from "@/lib/utils"

const groups: { key: SkillGroup; label: string; emoji: string; color: string }[] = [
  { key: "python-core", label: "Python Core", emoji: "🐍", color: "text-violet-400" },
  { key: "architecture", label: "Architecture", emoji: "🏗", color: "text-blue-400" },
  { key: "testing", label: "Testing", emoji: "🧪", color: "text-emerald-400" },
  { key: "devops", label: "DevOps", emoji: "🚀", color: "text-orange-400" },
]

export default function ChecklistPage() {
  const [skills, setSkills] = useLocalStorage<SkillItem[]>("py_skills", initialSkillChecklist)

  const toggle = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  const groupProgress = (group: SkillGroup) => {
    const g = skills.filter(s => s.group === group)
    const done = g.filter(s => s.completed).length
    return { done, total: g.length, pct: Math.round((done / g.length) * 100) }
  }

  const totalDone = skills.filter(s => s.completed).length
  const totalPct = Math.round((totalDone / skills.length) * 100)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skill Checklist</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track 4 nhóm kỹ năng — {totalDone}/{skills.length} completed ({totalPct}%)
        </p>
      </div>

      {/* Overall progress */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">Overall Progress</p>
              <p className="text-sm text-muted-foreground">Mục tiêu: 100% trước khi đi làm</p>
            </div>
            <div className="text-3xl font-bold text-primary">{totalPct}%</div>
          </div>
          <Progress value={totalPct} className="h-3" />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {groups.map(g => {
              const { done, total, pct } = groupProgress(g.key)
              return (
                <div key={g.key} className="text-center">
                  <div className="text-lg font-bold">{pct}%</div>
                  <div className="text-xs text-muted-foreground">{g.emoji} {g.label}</div>
                  <div className="text-xs text-muted-foreground">{done}/{total}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs per group */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          {groups.map(g => (
            <TabsTrigger key={g.key} value={g.key}>{g.emoji} {g.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map(g => {
              const items = skills.filter(s => s.group === g.key)
              const { done, total, pct } = groupProgress(g.key)
              return (
                <Card key={g.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={cn("text-sm flex items-center gap-2", g.color)}>
                        <span>{g.emoji}</span> {g.label}
                      </CardTitle>
                      <Badge variant={pct === 100 ? "default" : "outline"} className="text-xs">
                        {done}/{total}
                      </Badge>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {items.map(skill => (
                      <div
                        key={skill.id}
                        onClick={() => toggle(skill.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-all duration-200",
                          skill.completed
                            ? "bg-success/5 border border-success/20"
                            : "hover:bg-muted/50 border border-transparent"
                        )}
                      >
                        <Checkbox
                          checked={skill.completed}
                          onCheckedChange={() => toggle(skill.id)}
                          id={skill.id}
                        />
                        <label
                          htmlFor={skill.id}
                          className={cn(
                            "text-sm cursor-pointer flex-1 leading-tight",
                            skill.completed ? "line-through text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {skill.label}
                        </label>
                        {skill.completed && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {groups.map(g => {
          const items = skills.filter(s => s.group === g.key)
          const { done, total, pct } = groupProgress(g.key)
          return (
            <TabsContent key={g.key} value={g.key}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={cn("flex items-center gap-2", g.color)}>
                      {g.emoji} {g.label}
                    </CardTitle>
                    <Badge variant={pct === 100 ? "default" : "secondary"} className="text-sm px-3">
                      {done}/{total} — {pct}%
                    </Badge>
                  </div>
                  <Progress value={pct} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map(skill => (
                    <div
                      key={skill.id}
                      onClick={() => toggle(skill.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-4 py-3 cursor-pointer transition-all duration-200 border",
                        skill.completed
                          ? "bg-success/5 border-success/20"
                          : "border-border hover:bg-muted/40 hover:border-primary/30"
                      )}
                    >
                      <Checkbox
                        checked={skill.completed}
                        onCheckedChange={() => toggle(skill.id)}
                        id={`tab-${skill.id}`}
                      />
                      <label htmlFor={`tab-${skill.id}`} className={cn("text-sm cursor-pointer flex-1", skill.completed && "line-through text-muted-foreground")}>
                        {skill.label}
                      </label>
                      {skill.completed && <CheckCircle2 className="h-4 w-4 text-success" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
