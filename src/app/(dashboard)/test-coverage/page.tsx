"use client"

import { FlaskConical, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { initialTestCoverage } from "@/data/seed-data"
import type { TestCoverageEntry } from "@/types"
import { cn } from "@/lib/utils"

const statusIcon = {
  "pass": <CheckCircle2 className="h-4 w-4 text-success" />,
  "fail": <XCircle className="h-4 w-4 text-destructive" />,
  "not-tested": <AlertCircle className="h-4 w-4 text-muted-foreground" />,
}

export default function TestCoveragePage() {
  const [coverage] = useLocalStorage<TestCoverageEntry[]>("py_test_coverage", initialTestCoverage)

  const overallCoverage = Math.round(
    coverage.reduce((sum, c) => sum + c.coverage, 0) / (coverage.length || 1)
  )

  const passed = coverage.filter(c => c.status === "pass").length

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test Coverage</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Theo dõi mức độ bao phủ test (Target ≥80% cho mọi module)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <FlaskConical className="h-4 w-4" /> Overall System Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold text-primary">{overallCoverage}%</div>
              <div className="text-sm text-muted-foreground">Target: 80%</div>
            </div>
            <Progress value={overallCoverage} className="h-3 bg-primary/10" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Modules Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{passed}<span className="text-muted-foreground text-xl font-medium">/{coverage.length}</span></div>
            <p className="text-xs text-muted-foreground mt-1">Đạt target coverage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Module Details</CardTitle>
          <CardDescription>Chi tiết coverage từng phần của dự án</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coverage.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.module}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[120px]">
                      <span className={cn("text-sm font-medium", item.coverage >= item.targetCoverage ? "text-success" : "text-foreground")}>
                        {item.coverage}%
                      </span>
                      <Progress value={item.coverage} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.targetCoverage}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {statusIcon[item.status]}
                      <span className="text-xs capitalize">{item.status.replace("-", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {item.lastRun || "Never"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
