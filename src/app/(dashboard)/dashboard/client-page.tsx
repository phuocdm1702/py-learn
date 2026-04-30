"use client"
import Image from "next/image"

import { BookOpen, CheckSquare, Flame, Clock, Globe, GitCommit, GitFork, Star, CircleDot, PlayCircle, Code2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts"
import { initialSkillChecklist, initialRoadmapLayers } from "@/data/seed-data"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { SkillItem, DailyLogEntry } from "@/types"
import type { GithubProfile, GithubRepo, GithubCommit, GithubWorkflowRun, GithubLanguages } from "@/types/github"
import { cn } from "@/lib/utils"

const weeklyProgress = [
  { day: "T2", hours: 2.5 }, { day: "T3", hours: 3 }, { day: "T4", hours: 1.5 },
  { day: "T5", hours: 2 }, { day: "T6", hours: 3.5 }, { day: "T7", hours: 4 }, { day: "CN", hours: 2 },
]

function StatCard({
  title, value, subtitle, icon: Icon, color = "primary", iconColor
}: {
  title: string; value: string | number; subtitle?: string
  icon: React.ElementType; color?: string; iconColor?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${color}/10`}>
          <Icon className={cn("h-4 w-4", iconColor || `text-${color}`)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

interface DashboardClientProps {
  githubProfile: GithubProfile | null
  githubRepo: GithubRepo | null
  githubCommits: GithubCommit[]
  githubWorkflows: GithubWorkflowRun[]
  githubLanguages: GithubLanguages | null
}

export function DashboardClient({ githubProfile, githubRepo, githubCommits, githubWorkflows, githubLanguages }: DashboardClientProps) {
  const [skills] = useLocalStorage<SkillItem[]>("py_skills", initialSkillChecklist)
  const [logs] = useLocalStorage<DailyLogEntry[]>("py_daily_logs", [])

  const completedSkills = skills?.filter(s => s.completed).length || 0
  const totalSkills = skills?.length || 1
  const skillPct = Math.round((completedSkills / totalSkills) * 100)

  const completedLayers = initialRoadmapLayers.filter(l => l.status === "completed").length
  const totalHours = logs?.reduce((sum, l) => sum + l.hours, 0) || 0
  const currentStreak = 3 // mock

  const groupProgress = (group: string) => {
    const g = skills?.filter(s => s.group === group) || []
    const done = g.filter(s => s.completed).length
    return { done, total: g.length, pct: g.length ? Math.round((done / g.length) * 100) : 0 }
  }

  // Parse languages
  const totalLangBytes = githubLanguages ? Object.values(githubLanguages).reduce((a, b) => a + b, 0) : 1
  const topLanguages = githubLanguages 
    ? Object.entries(githubLanguages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, bytes]) => ({ name, pct: Math.round((bytes / totalLangBytes) * 100) }))
    : []

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Chào mừng trở lại, Python Learner 🔥 — Hardcore Mode đang chạy
          </p>
        </div>
        {githubProfile && (
          <div className="flex items-center gap-3 bg-muted/50 p-2.5 rounded-lg border border-border">
            <Image src={githubProfile.avatar_url} alt="GitHub" width={32} height={32} className="rounded-full border border-border" />
            <div className="text-sm">
              <p className="font-semibold">{githubProfile.login}</p>
              <p className="text-xs text-muted-foreground">{githubProfile.public_repos} Public Repos</p>
            </div>
            <Globe className="w-5 h-5 ml-2 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* GitHub Repo Metrics (Live) */}
      {githubRepo && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Repo Stars" value={githubRepo.stargazers_count} subtitle={githubRepo.full_name} icon={Star} iconColor="text-amber-400" />
          <StatCard title="Forks" value={githubRepo.forks_count} subtitle="Cộng đồng đóng góp" icon={GitFork} iconColor="text-blue-400" />
          <StatCard title="Open Issues" value={githubRepo.open_issues_count} subtitle="Cần xử lý" icon={CircleDot} iconColor="text-emerald-400" />
          <StatCard title="Recent Commits" value={githubCommits.length} subtitle="Hoạt động mới nhất" icon={GitCommit} iconColor="text-purple-400" />
        </div>
      )}

      {/* Local Learning Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Skill Hoàn Thành" value={`${completedSkills}/${totalSkills}`} subtitle={`${skillPct}% overall progress`} icon={CheckSquare} />
        <StatCard title="Layer Completed" value={`${completedLayers}/10`} subtitle="Sequential learning path" icon={BookOpen} />
        <StatCard title="Tổng Giờ Học" value={`${totalHours}h`} subtitle={logs?.length > 0 ? `${logs.length} log entries` : "Chưa có log"} icon={Clock} />
        <StatCard title="Current Streak" value={`${currentStreak} ngày`} subtitle="Keep it up! 💪" icon={Flame} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Weekly Hours Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Giờ Học Trong Tuần</CardTitle>
            <CardDescription>Tuần hiện tại — target 2h/ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262 83% 62%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(262 83% 62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area type="monotone" dataKey="hours" stroke="hsl(262 83% 62%)" strokeWidth={2} fill="url(#colorHours)" name="Giờ học" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GitHub Live Feeds */}
        <div className="space-y-4">
          {/* Top Languages */}
          {topLanguages.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4" /> Repo Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topLanguages.map(lang => (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{lang.name}</span>
                      <span className="text-muted-foreground">{lang.pct}%</span>
                    </div>
                    <Progress value={lang.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Workflow Status */}
          {githubWorkflows && githubWorkflows.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" /> GitHub Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {githubWorkflows.slice(0, 3).map(wf => (
                    <a key={wf.id} href={wf.html_url} target="_blank" rel="noreferrer" className="flex items-center justify-between group">
                      <div className="truncate">
                        <p className="text-sm font-medium group-hover:underline truncate max-w-[150px]">{wf.name}</p>
                        <p className="text-xs text-muted-foreground">{wf.created_at.split("T")[0]}</p>
                      </div>
                      <Badge variant={wf.conclusion === "success" ? "default" : wf.conclusion === "failure" ? "destructive" : "secondary"} className="text-[10px] uppercase">
                        {wf.conclusion || wf.status}
                      </Badge>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent GitHub Commits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitCommit className="h-4 w-4" /> Live Commits (py-learn)
            </CardTitle>
            <CardDescription>Hoạt động code thực tế trên GitHub</CardDescription>
          </CardHeader>
          <CardContent>
            {githubCommits.length > 0 ? (
              <div className="space-y-4">
                {githubCommits.map(c => (
                  <div key={c.sha} className="flex gap-3">
                    <div className="mt-1">
                      <GitCommit className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={c.commit.message}>
                        <a href={c.html_url} target="_blank" rel="noreferrer" className="hover:underline">
                          {c.commit.message}
                        </a>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-mono text-[10px] bg-muted px-1 rounded">{c.sha.substring(0, 7)}</span>
                        <span>•</span>
                        <span>{c.commit.author.date.replace("T", " ").replace("Z", "")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Không có dữ liệu commit.</p>
            )}
          </CardContent>
        </Card>

        {/* Skill Group Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill Group Progress</CardTitle>
            <CardDescription>4 nhóm kỹ năng theo skill profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { key: "python-core", label: "Python Core" },
              { key: "architecture", label: "Architecture & System" },
              { key: "testing", label: "Testing" },
              { key: "devops", label: "DevOps & CI/CD" },
            ].map(({ key, label }) => {
              const { done, total, pct } = groupProgress(key)
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{done}/{total} — <span className="font-semibold text-foreground">{pct}%</span></span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
