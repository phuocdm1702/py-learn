"use client"

import { Code2, BookOpen, PlayCircle, Lock, CheckCircle2, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { initialRoadmapLayers } from "@/data/seed-data"

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10 border-success/30", label: "Completed" },
  "in-progress": { icon: Zap, color: "text-primary", bg: "bg-primary/10 border-primary/30", label: "In Progress" },
  locked: { icon: Lock, color: "text-muted-foreground", bg: "bg-muted/30 border-border", label: "Locked" },
}

export default function LearnPage() {
  const sequential = initialRoadmapLayers.filter(l => l.type === "sequential")

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Center</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Khóa học Python từ cơ bản đến nâng cao — 10 layers sequential
        </p>
      </div>

      {/* Coming soon banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Interactive Lessons Coming Soon</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Tính năng học tương tác với code editor, quiz, và real-time feedback đang được phát triển.
                Hiện tại bạn có thể xem roadmap và track tiến độ qua Skill Checklist.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary">Code Editor</Badge>
                <Badge variant="secondary">Quiz System</Badge>
                <Badge variant="secondary">AI Tutor</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson list */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">
            Course Modules
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sequential.map((layer, index) => {
            const cfg = statusConfig[layer.status]
            const Icon = cfg.icon
            const isLocked = layer.status === "locked"

            return (
              <Card 
                key={layer.id} 
                className={cn(
                  "border transition-all duration-200",
                  cfg.bg,
                  !isLocked && "hover:shadow-md cursor-pointer",
                  isLocked && "opacity-60"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", cfg.bg)}>
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-sm leading-tight">{layer.title}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{layer.subtitle}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={layer.status === "in-progress" ? "default" : "outline"} className="text-xs">
                      {cfg.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {layer.skills.slice(0, 4).map((skill) => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center rounded-md bg-background/50 border border-border px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                    {layer.skills.length > 4 && (
                      <span className="text-xs text-muted-foreground">+{layer.skills.length - 4} more</span>
                    )}
                  </div>
                  {!isLocked && (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">0</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">9</div>
              <div className="text-xs text-muted-foreground">Locked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
