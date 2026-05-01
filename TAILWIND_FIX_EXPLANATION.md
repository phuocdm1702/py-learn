# 🎨 Tailwind Dynamic Classes Issue & Solutions

## ❌ Current Problem

```typescript
// src/app/(dashboard)/dashboard/client-page.tsx
<div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${color}/10`}>
<Icon className={cn("h-4 w-4", iconColor || `text-${color}`)} />
```

**Why this doesn't work:**
- Tailwind CSS 4.x uses Just-In-Time (JIT) compilation
- Only hardcoded classes in source files are generated
- `bg-${color}/10` and `text-${color}` are NOT valid Tailwind classes
- Result: No background colors, no icon colors → broken UI

## ✅ Solution 1: Predefined Variants (Recommended)

```typescript
// Define all possible color variants
const colorVariants = {
  primary: "bg-primary/10",
  amber: "bg-amber-500/10", 
  blue: "bg-blue-500/10",
  emerald: "bg-emerald-500/10",
  purple: "bg-purple-500/10",
}

const iconColorVariants = {
  primary: "text-primary",
  amber: "text-amber-400",
  blue: "text-blue-400", 
  emerald: "text-emerald-400",
  purple: "text-purple-400",
}

// Usage
<div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", colorVariants[color])}>
  <Icon className={cn("h-4 w-4", iconColor || iconColorVariants[color])} />
</div>
```

## ✅ Solution 2: CSS Variables (Alternative)

```typescript
// In globals.css
.stat-card {
  --stat-bg: hsl(var(--primary) / 0.1);
  --stat-icon: hsl(var(--primary));
}

.stat-card.amber {
  --stat-bg: hsl(38 92% 50% / 0.1);
  --stat-icon: hsl(38 92% 50%);
}

// In component
<div className={cn("stat-card", color === "amber" && "amber")}>
  <Icon className="h-4 w-4" style={{ color: "var(--stat-icon)" }} />
</div>
```

## ✅ Solution 3: Tailwind Safelist (Global)

```typescript
// tailwind.config.js
module.exports = {
  safelist: [
    'bg-primary/10',
    'bg-amber-500/10', 
    'bg-blue-500/10',
    'bg-emerald-500/10',
    'bg-purple-500/10',
    'text-primary',
    'text-amber-400',
    'text-blue-400',
    'text-emerald-400', 
    'text-purple-400',
  ]
}
```

## 🎯 Recommended Approach

**Use Solution 1 (Predefined Variants)** because:
- ✅ Works with Tailwind JIT
- ✅ Type-safe with TypeScript
- ✅ Easy to maintain
- ✅ No config changes needed
- ✅ Follows best practices

## 🔄 How to Fix Current Code

Replace the problematic sections:

```typescript
// ❌ REMOVE
const weeklyProgress = [
  { day: "T2", hours: 2.5 }, { day: "T3", hours: 3 }, ...
]

// ✅ ADD (calculate from real logs)
const getWeekProgress = () => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  const today = new Date()
  const weekData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const dayLogs = logs?.filter(l => l.date === dateStr) || []
    const hours = dayLogs.reduce((sum, l) => sum + l.hours, 0)
    weekData.push({
      day: days[date.getDay()],
      hours: Math.round(hours * 10) / 10,
      date: dateStr
    })
  }
  return weekData
}
const weeklyProgress = getWeekProgress()

// ❌ REMOVE
const currentStreak = 3 // mock

// ✅ ADD (calculate from real logs)
const calculateStreak = (logEntries: DailyLogEntry[]): number => {
  if (!logEntries || logEntries.length === 0) return 0
  const dates = [...new Set(logEntries.map(l => l.date))].sort().reverse()
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    const expected = expectedDate.toISOString().split("T")[0]
    if (dates[i] === expected) streak++
    else break
  }
  return streak
}
const currentStreak = calculateStreak(logs || [])
```

## 🚀 Benefits of Fixing

1. **Real data**: Weekly chart shows actual learning hours
2. **Accurate streak**: Calculated from real daily logs  
3. **Working colors**: Icons and backgrounds display correctly
4. **Better UX**: Dashboard reflects real progress
5. **Production-ready**: No broken styles

## 📋 Implementation Checklist

- [ ] Add color variants constants
- [ ] Update StatCard to use variants
- [ ] Replace hardcoded weekly progress
- [ ] Replace hardcoded streak
- [ ] Test all color combinations
- [ ] Verify weekly chart updates with new logs
- [ ] Check streak calculation with consecutive days
