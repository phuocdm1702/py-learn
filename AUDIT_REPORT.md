# 🔍 UI/UX AUDIT REPORT — PyLearn OS

**Date:** 2026-05-01  
**Auditor:** Senior Frontend Engineer + UI/UX Auditor  
**Project:** PyLearn OS — Python Learning Dashboard  
**Stack:** Next.js 16, React 19, TailwindCSS 4, shadcn/ui, Recharts

---

## 1. TỔNG QUAN HỆ THỐNG

PyLearn OS là một learning dashboard được thiết kế để track tiến trình học Python theo mô hình "Hardcore Mode". Hệ thống có cấu trúc Next.js chuẩn với route groups `(dashboard)`, sử dụng shadcn/ui components và tích hợp GitHub API để hiển thị real-time metrics. Overall architecture khá tốt, nhưng còn nhiều vấn đề UX và missing features để trở thành sản phẩm hoàn chỉnh.

---

## 2. ĐIỂM MẠNH

- **Cấu trúc thư mục clean**: Sử dụng route groups `(dashboard)` đúng chuẩn Next.js App Router
- **Design system nhất quán**: Violet Slate theme với CSS variables, dark mode default phù hợp dev
- **Component library chuẩn**: shadcn/ui + Radix primitives đảm bảo accessibility cơ bản
- **GitHub integration live**: Fetch real data từ GitHub API với ISR caching
- **Responsive sidebar**: Mobile-first với overlay + backdrop blur
- **Local storage persistence**: Data survives refresh, phù hợp cho personal tool
- **Visual hierarchy tốt**: Progress bars, badges, cards với consistent spacing

---

## 3. VẤN ĐỀ NGHIÊM TRỌNG (CRITICAL ISSUES)

### 3.1 ❌ Hardcoded GitHub Username & Repo

**Mô tả:** Username `phuocdm1702` và repo `py-learn` được hardcode trong `page.tsx`:

```typescript
// src/app/(dashboard)/dashboard/page.tsx:12-13
const username = "phuocdm1702"
const repoName = "py-learn"
```

**Tác động:**
- Dashboard không reusable cho user khác
- Mỗi user muốn dùng phải fork và sửa code
- Không thể deploy như SaaS product

**Cách fix:**
1. Move vào Settings page để user config
2. Lưu vào localStorage hoặc database
3. Pass qua props hoặc context

```typescript
// ✅ Fix: Lấy từ settings
const settings = useLocalStorage<UserSettings>("py_settings", defaultSettings)
const username = settings.githubUsername || "phuocdm1702"
const repoName = settings.githubRepo || "py-learn"
```

---

### 3.2 ❌ Dynamic Tailwind Classes (Won't Work)

**Mô tả:** Sử dụng template literals cho Tailwind classes:

```typescript
// src/app/(dashboard)/dashboard/client-page.tsx:32
<div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${color}/10`}>
```

**Tác động:**
- Tailwind không detect dynamic classes → styles không apply
- Purple/primary colors sẽ không work

**Cách fix:** Dùng CSS variables hoặc safelist:

```typescript
// ✅ Fix với cn() và predefined variants
const colorVariants = {
  primary: "bg-primary/10",
  amber: "bg-amber-500/10",
  blue: "bg-blue-500/10",
}
<div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", colorVariants[color])}>
```

---

### 3.3 ❌ Empty `/learn` Directory — Core Feature Missing

**Mô tả:** Thư mục `src/app/(dashboard)/learn/` rỗng, không có page nào.

**Tác động:**
- Không có nơi để học thực tế (lesson, code editor, quiz)
- Dashboard chỉ là tracking tool, không phải learning platform
- User phải navigate ra ngoài để học → poor UX

**Cách fix:** Tạo các page:
- `/learn/[layerId]` — Lesson detail
- `/learn/[layerId]/practice` — Code editor
- `/learn/[layerId]/quiz` — Quiz

---

### 3.4 ❌ Theme Toggle Duplication

**Mô tả:** Theme logic duplicate ở 2 nơi:
- `header.tsx` — toggle button
- `settings/page.tsx` — theme selection

**Tác động:**
- Race condition khi sync giữa 2 nơi
- Code duplication → maintenance nightmare

**Cách fix:** Tạo `useTheme` hook:

```typescript
// src/hooks/use-theme.ts
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("py_theme", "dark")
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])
  
  return { theme, setTheme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") }
}
```

---

### 3.5 ❌ Streak Calculation Mocked

**Mô tả:** `currentStreak = 3` hardcode trong dashboard:

```typescript
// src/app/(dashboard)/dashboard/client-page.tsx:62
const currentStreak = 3 // mock
```

**Tác động:**
- Streak không phản ánh thực tế
- Gamification element không hoạt động

**Cách fix:** Calculate từ daily logs:

```typescript
// ✅ Calculate streak từ logs
const calculateStreak = (logs: DailyLogEntry[]): number => {
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
  let streak = 0
  const today = new Date().toISOString().split("T")[0]
  
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toISOString().split("T")[0]
    if (dates[i] === expected) streak++
    else break
  }
  return streak
}
```

---

## 4. VẤN ĐỀ TRUNG BÌNH (IMPROVEMENTS)

### 4.1 ⚠️ Weekly Progress Hardcoded

```typescript
// src/app/(dashboard)/dashboard/client-page.tsx:17-20
const weeklyProgress = [
  { day: "T2", hours: 2.5 }, { day: "T3", hours: 3 }, ...
]
```

**Fix:** Calculate từ daily logs theo tuần hiện tại.

---

### 4.2 ⚠️ No Error Boundary

- GitHub API fail → silent null, không có error UI
- Thêm Error Boundary hoặc skeleton loading states

---

### 4.3 ⚠️ Missing Loading States

- Dashboard fetch GitHub data → không có loading indicator
- User thấy flash của empty state

**Fix:** Thêm `Suspense` + `Skeleton`:

```typescript
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardClient ... />
</Suspense>
```

---

### 4.4 ⚠️ Navigation Links to Non-existent Routes

Sidebar có link `/roadmap#git`, `/roadmap#testing` nhưng page không có anchor sections.

---

### 4.5 ⚠️ No SEO Optimization

- Missing Open Graph tags
- No structured data (JSON-LD)
- `lang="vi"` nhưng content mix English/Vietnamese

---

### 4.6 ⚠️ useLocalStorage Returns `isLoaded` But Not Used

```typescript
// src/hooks/use-local-storage.ts:36
return [storedValue, setValue, isLoaded] as const
```

Page components không sử dụng `isLoaded` → có thể có hydration mismatch.

---

## 5. VẤN ĐỀ NHỎ (POLISH UI)

### 5.1 🔧 Inconsistent Emoji Usage

- Sidebar: "🔥", "⚡"
- Dashboard: "🔥", "💪"
- Settings: "📝"

**Recommend:** Remove emoji hoặc dùng icon library (Lucide) cho consistency.

---

### 5.2 🔧 Mixed Language Labels

- "Skill Hoàn Thành" vs "Layer Completed"
- "Tổng Giờ Học" vs "Overall Progress"

**Recommend:** Chọn 1 ngôn ngữ (prefer Vietnamese cho target user).

---

### 5.3 🔧 Sidebar Profile Section Static

```typescript
// src/components/layout/sidebar.tsx:129
<p className="truncate text-sm font-medium text-sidebar-foreground">Python Learner</p>
```

Nên lấy từ `settings.name`.

---

### 5.4 🔧 No Keyboard Navigation for Checklist

- Checkbox items không có focus ring rõ ràng
- Enter key không toggle checkbox

---

### 5.5 🔧 Table Responsive Issues

- Daily Log table truncate content trên mobile
- Nên có horizontal scroll hoặc card view trên mobile

---

## 6. ĐỀ XUẤT NÂNG CẤP (UPGRADE ROADMAP)

### 📅 Ngắn hạn (1–2 tuần)

1. **Fix critical issues** — Dynamic classes, hardcoded values
2. **Add loading states** — Skeleton, Suspense
3. **Create `/learn` placeholder** — Basic lesson list
4. **Implement streak calculation** — Real data
5. **Extract theme hook** — DRY principle

---

### 📅 Trung hạn (1–2 tháng)

1. **Build Learning Module:**
   - Lesson pages với markdown content
   - Embedded code editor (Monaco Editor)
   - Quiz system với instant feedback

2. **Progress Tracking:**
   - Visual roadmap với clickable nodes
   - Layer unlock logic
   - Achievement badges

3. **Data Persistence:**
   - Migrate từ localStorage → SQLite/PostgreSQL
   - User authentication (Clerk/NextAuth)

---

### 📅 Dài hạn (3–6 tháng)

1. **Gamification:**
   - XP system
   - Daily streak rewards
   - Leaderboard

2. **Social Features:**
   - Share progress
   - Study groups

3. **AI Integration:**
   - AI tutor chat
   - Code review assistant
   - Personalized learning path

---

## 7. CHẤM ĐIỂM TỔNG THỂ

| Category | Score | Notes |
|----------|-------|-------|
| **UI/UX** | 6/10 | Good visual design, but missing core learning features |
| **Code Quality** | 7/10 | Clean structure, but has anti-patterns (dynamic classes, duplication) |
| **Product Readiness** | 4/10 | Only tracking dashboard, not a learning platform yet |

---

## 8. SO SÁNH VỚI PLATFORMS TƯƠNG TỰ

| Feature | PyLearn OS | Codecademy | LeetCode | freeCodeCamp |
|---------|------------|------------|----------|---------------|
| Interactive Lessons | ❌ | ✅ | ❌ | ✅ |
| Code Editor | ❌ | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ | ✅ | ✅ |
| Quiz/Assessment | ❌ | ✅ | ✅ | ✅ |
| Gamification | ⚠️ | ✅ | ✅ | ⚠️ |
| Social Features | ❌ | ⚠️ | ✅ | ❌ |
| Mobile Responsive | ⚠️ | ✅ | ✅ | ✅ |
| Offline Support | ❌ | ❌ | ❌ | ⚠️ |

---

## 9. MISSING FEATURES QUAN TRỌNG

1. **Interactive Code Editor** — Core của learning platform
2. **Lesson Content System** — Markdown/MDX lessons
3. **Quiz Engine** — Multiple choice, fill-in-blank, code challenge
4. **User Authentication** — Multi-user support
5. **Progress Persistence** — Database thay vì localStorage
6. **Search Functionality** — Find lessons, skills
7. **Notifications** — Reminder to study, streak alerts
8. **Export/Import Data** — Backup progress

---

**END OF REPORT**

Generated by Senior Frontend Engineer + UI/UX Auditor
