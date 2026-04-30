import type { RoadmapLayer, SkillItem, TestCoverageEntry, UserSettings } from "@/types"

// =================== Roadmap Data ===================
export const initialRoadmapLayers: RoadmapLayer[] = [
  {
    id: 1, title: "Python Foundation", subtitle: "Syntax, Data Structures, Functions, Files",
    type: "sequential",
    skills: ["Variables & Types", "List / Dict / Set / Tuple", "Functions & Scoping (LEGB)", "File I/O", "Exception Handling"],
    status: "in-progress",
  },
  {
    id: 2, title: "Project Structure", subtitle: "Module, Package, Import System",
    type: "sequential",
    skills: ["Package & __init__.py", "Relative vs Absolute imports", "Folder organization", "Poetry / Pipenv", "Virtual Environment"],
    status: "locked",
  },
  {
    id: 3, title: "Practical Python", subtitle: "CLI Tools, File Processing, Logging",
    type: "sequential",
    skills: ["argparse / click", "File processing scripts", "Structured logging", "Error handling patterns"],
    status: "locked",
  },
  {
    id: 4, title: "OOP + Design Patterns", subtitle: "Python vs Java OOP Thinking",
    type: "sequential",
    skills: ["Protocols & ABCs", "Mixins", "Decorators", "Design Patterns (Strategy, Factory, Observer)", "Dataclasses"],
    status: "locked",
  },
  {
    id: 5, title: "Advanced Python", subtitle: "Decorator, Generator, Async",
    type: "sequential",
    skills: ["Generators & Iterators", "Context Managers", "Asyncio fundamentals", "Type Hints & Typing module", "Memory Management & GIL"],
    status: "locked",
  },
  {
    id: 6, title: "Database", subtitle: "SQLAlchemy, CRUD, Query Optimization",
    type: "sequential",
    skills: ["SQLAlchemy Core vs ORM", "Alembic Migrations", "Query optimization", "Indexes & transactions", "PostgreSQL basics"],
    status: "locked",
  },
  {
    id: 7, title: "Backend (FastAPI)", subtitle: "API Design, Auth, Middleware",
    type: "sequential",
    skills: ["FastAPI basics & routing", "Pydantic validation", "Dependency Injection", "JWT / OAuth2", "Middleware & CORS"],
    status: "locked",
  },
  {
    id: 8, title: "Fullstack", subtitle: "ReactJS + API Integration",
    type: "sequential",
    skills: ["React basics", "API calls (fetch / axios)", "State management", "Auth flow frontend", "Deploy frontend"],
    status: "locked",
  },
  {
    id: 9, title: "DevOps + CI/CD", subtitle: "Docker, GitHub Actions",
    type: "sequential",
    skills: ["Dockerfile + docker-compose", "Multi-stage builds", "GitHub Actions workflow", "CI: lint + test", "CD: deploy pipeline"],
    status: "locked",
  },
  {
    id: 10, title: "Data Processing", subtitle: "Pandas, ETL Pipelines",
    type: "sequential",
    skills: ["Pandas fundamentals", "Data cleaning & transform", "ETL patterns", "Performance optimization", "Integration with backend"],
    status: "locked",
  },
  {
    id: 11, title: "Git + Commits", subtitle: "Parallel từ Tuần 1",
    type: "parallel",
    skills: ["Conventional Commits", "Gitflow branching", "PR workflow", "Code review basics"],
    status: "in-progress",
  },
  {
    id: 12, title: "Testing", subtitle: "Parallel — cơ bản → nâng cao",
    type: "parallel",
    skills: ["pytest & fixtures", "mock/patch", "Coverage ≥ 80%", "Integration tests", "API tests (httpx)"],
    status: "in-progress",
  },
  {
    id: 13, title: "Clean Code", subtitle: "Parallel — luôn áp dụng",
    type: "parallel",
    skills: ["Type hints toàn bộ", "Ruff / Black linting", "Refactoring patterns", "DRY & SOLID"],
    status: "in-progress",
  },
]

// =================== Skill Checklist ===================
export const initialSkillChecklist: SkillItem[] = [
  // Python Core
  { id: "pc1", group: "python-core", label: "Hiểu sâu Memory Management & GIL", completed: false },
  { id: "pc2", group: "python-core", label: "Thành thạo Decorators & Context Managers", completed: false },
  { id: "pc3", group: "python-core", label: "Thành thạo Asynchronous Programming (asyncio)", completed: false },
  { id: "pc4", group: "python-core", label: "List Comprehension & Generator Expression", completed: false },
  { id: "pc5", group: "python-core", label: "Type Hints toàn bộ codebase", completed: false },
  // Architecture
  { id: "ar1", group: "architecture", label: "Thiết kế API chuẩn RESTful/Stateless", completed: false },
  { id: "ar2", group: "architecture", label: "Tách lớp: Controller → Service → Repository", completed: false },
  { id: "ar3", group: "architecture", label: "Implement Dependency Injection trong FastAPI", completed: false },
  { id: "ar4", group: "architecture", label: "Hiểu Monolith vs Microservices", completed: false },
  { id: "ar5", group: "architecture", label: "Clean Architecture / Layered Architecture", completed: false },
  // Testing
  { id: "te1", group: "testing", label: "Viết Unit test với pytest", completed: false },
  { id: "te2", group: "testing", label: "Dùng mock/patch thành thạo", completed: false },
  { id: "te3", group: "testing", label: "Coverage ≥ 80% cho core modules", completed: false },
  { id: "te4", group: "testing", label: "Integration test với Database", completed: false },
  { id: "te5", group: "testing", label: "API test với httpx", completed: false },
  // DevOps
  { id: "dv1", group: "devops", label: "Dockerize ứng dụng (Dev/Prod)", completed: false },
  { id: "dv2", group: "devops", label: "Setup CI/CD pipeline GitHub Actions", completed: false },
  { id: "dv3", group: "devops", label: "Deploy backend lên server + Nginx/HTTPS", completed: false },
  { id: "dv4", group: "devops", label: "Environment config (.env, secrets)", completed: false },
]

// =================== Test Coverage ===================
export const initialTestCoverage: TestCoverageEntry[] = [
  { id: "tc1", module: "utils/", coverage: 0, status: "not-tested", lastRun: "", targetCoverage: 80 },
  { id: "tc2", module: "models/", coverage: 0, status: "not-tested", lastRun: "", targetCoverage: 80 },
  { id: "tc3", module: "services/", coverage: 0, status: "not-tested", lastRun: "", targetCoverage: 80 },
  { id: "tc4", module: "api/routes/", coverage: 0, status: "not-tested", lastRun: "", targetCoverage: 90 },
  { id: "tc5", module: "auth/", coverage: 0, status: "not-tested", lastRun: "", targetCoverage: 95 },
]

// =================== Default Settings ===================
export const defaultSettings: UserSettings = {
  name: "Python Learner",
  background: "Java Spring Boot · VueJS · SQL/NoSQL",
  hoursPerDay: 2,
  daysPerWeek: 5,
  targetWeeks: 24,
  theme: "dark",
}
