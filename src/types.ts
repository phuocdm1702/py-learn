// =================== Skill Checklist ===================
export type SkillGroup = "python-core" | "architecture" | "testing" | "devops"

export interface SkillItem {
  id: string
  group: SkillGroup
  label: string
  description?: string
  completed: boolean
}

// =================== Daily Log ===================
export type WorkflowStep = "THINK" | "PROPOSE" | "CODE" | "TEST" | "REVIEW" | "FIX"

export interface DailyLogEntry {
  id: string
  date: string
  topic: string
  layer: number // roadmap layer 1-10
  hours: number
  step: WorkflowStep
  result: string
  notes: string
}

// =================== Test Coverage ===================
export type CoverageStatus = "pass" | "fail" | "not-tested"

export interface TestCoverageEntry {
  id: string
  module: string
  coverage: number
  status: CoverageStatus
  lastRun: string
  targetCoverage: number
}

// =================== Roadmap ===================
export type LayerStatus = "locked" | "in-progress" | "completed"

export interface RoadmapLayer {
  id: number
  title: string
  subtitle: string
  type: "sequential" | "parallel"
  skills: string[]
  status: LayerStatus
  startedAt?: string
  completedAt?: string
}

// =================== Settings ===================
export interface UserSettings {
  name: string
  background: string
  hoursPerDay: number
  daysPerWeek: number
  targetWeeks: number
  theme: "dark" | "light"
  avatar?: string
  githubUsername?: string
  githubRepo?: string
}
