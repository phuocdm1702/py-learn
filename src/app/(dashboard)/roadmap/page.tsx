"use client"

import { CheckCircle2, Lock, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { initialRoadmapLayers } from "@/data/seed-data"
import type { RoadmapLayer } from "@/types"

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10 border-success/30", label: "Completed" },
  "in-progress": { icon: Zap, color: "text-primary", bg: "bg-primary/10 border-primary/30", label: "In Progress" },
  locked: { icon: Lock, color: "text-muted-foreground", bg: "bg-muted/30 border-border", label: "Locked" },
}

function LayerCard({ layer }: { layer: RoadmapLayer }) {
  const cfg = statusConfig[layer.status]
  const Icon = cfg.icon
  const isParallel = layer.type === "parallel"

  return (
    <Card className={cn("border transition-all duration-200", cfg.bg, layer.status === "in-progress" && "glow-primary")}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", cfg.bg)}>
              <Icon className={cn("h-4 w-4", cfg.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {!isParallel && <span className="text-xs font-mono text-muted-foreground">#{layer.id}</span>}
                <CardTitle className="text-sm leading-tight">{layer.title}</CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">{layer.subtitle}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={layer.status === "in-progress" ? "default" : "outline"} className="text-xs whitespace-nowrap">
              {cfg.label}
            </Badge>
            {isParallel && (
              <Badge variant="secondary" className="text-xs">Parallel</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {layer.skills.map((skill) => (
            <span key={skill} className="inline-flex items-center rounded-md bg-background/50 border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoadmapPage() {
  const sequential = initialRoadmapLayers.filter(l => l.type === "sequential")
  const parallel = initialRoadmapLayers.filter(l => l.type === "parallel")

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Roadmap</h1>
        <p className="text-muted-foreground text-sm mt-1">
          10 layers sequential + 3 parallel skills từ Tuần 1
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sequential layers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">Sequential — Học Theo Thứ Tự</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-7 top-8 bottom-8 w-px bg-border z-0" />
            <div className="space-y-3 relative z-10">
              {sequential.map((layer) => (
                <LayerCard key={layer.id} layer={layer} />
              ))}
            </div>
          </div>
        </div>

        {/* Parallel skills */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2">Parallel</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Card className="border-primary/20 bg-primary/5 p-4">
            <p className="text-xs text-primary/80 font-medium mb-3">
              ⚡ Chạy song song từ Tuần 1 — luôn áp dụng
            </p>
            <div className="space-y-3">
              {parallel.map((layer) => (
                <LayerCard key={layer.id} layer={layer} />
              ))}
            </div>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(statusConfig).map(([status, cfg]) => {
                const Icon = cfg.icon
                return (
                  <div key={status} className="flex items-center gap-2 text-sm">
                    <Icon className={cn("h-4 w-4", cfg.color)} />
                    <span className="text-muted-foreground">{cfg.label}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
