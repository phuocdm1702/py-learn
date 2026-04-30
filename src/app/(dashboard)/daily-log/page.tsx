"use client"

import { useState } from "react"
import { Plus, Trash2, Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { DailyLogEntry, WorkflowStep } from "@/types"
import { cn } from "@/lib/utils"

const STEPS: WorkflowStep[] = ["THINK", "PROPOSE", "CODE", "TEST", "REVIEW", "FIX"]
const STEP_COLORS: Record<WorkflowStep, string> = {
  THINK: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  PROPOSE: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CODE: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  TEST: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  REVIEW: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FIX: "bg-red-500/15 text-red-400 border-red-500/30",
}

const defaultEntry = (): Omit<DailyLogEntry, "id"> => ({
  date: new Date().toISOString().split("T")[0],
  topic: "",
  layer: 1,
  hours: 1,
  step: "CODE",
  result: "",
  notes: "",
})

export default function DailyLogPage() {
  const [logs, setLogs] = useLocalStorage<DailyLogEntry[]>("py_daily_logs", [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultEntry())

  const addEntry = () => {
    if (!form.topic) return
    const entry: DailyLogEntry = { ...form, id: Date.now().toString() }
    setLogs(prev => [entry, ...prev])
    setForm(defaultEntry())
    setShowForm(false)
  }

  const deleteEntry = (id: string) => setLogs(prev => prev.filter(l => l.id !== id))

  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Log</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {logs.length} entries — {totalHours}h tổng thời gian học
          </p>
        </div>
        <Button onClick={() => setShowForm(v => !v)} id="add-log-btn">
          <Plus className="h-4 w-4 mr-2" /> Thêm Log
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="border-primary/30 bg-primary/5 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary">📝 Log mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Ngày</label>
                <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} id="log-date" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Chủ đề / Topic</label>
                <Input placeholder="Ví dụ: Python List Comprehension" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} id="log-topic" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Layer (1-10)</label>
                <Input type="number" min={1} max={10} value={form.layer} onChange={e => setForm(p => ({ ...p, layer: +e.target.value }))} id="log-layer" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Số giờ</label>
                <Input type="number" min={0.5} step={0.5} value={form.hours} onChange={e => setForm(p => ({ ...p, hours: +e.target.value }))} id="log-hours" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Bước Workflow</label>
                <select
                  value={form.step}
                  onChange={e => setForm(p => ({ ...p, step: e.target.value as WorkflowStep }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  id="log-step"
                >
                  {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Kết quả</label>
                <Input placeholder="Đạt được gì hôm nay?" value={form.result} onChange={e => setForm(p => ({ ...p, result: e.target.value }))} id="log-result" />
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-medium text-muted-foreground">Notes</label>
                <Input placeholder="Ghi chú thêm..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} id="log-notes" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addEntry} id="save-log-btn">Lưu Log</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lịch sử học tập</CardTitle>
          <CardDescription>Mỗi entry = 1 buổi học theo Daily Workflow</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm">Chưa có log nào</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Nhấn "Thêm Log" để bắt đầu tracking</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Layer</TableHead>
                  <TableHead>Giờ</TableHead>
                  <TableHead>Bước</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{log.date}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">{log.topic}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">L{log.layer}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />{log.hours}h
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs border", STEP_COLORS[log.step])} variant="outline">
                        {log.step}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{log.result || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteEntry(log.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
