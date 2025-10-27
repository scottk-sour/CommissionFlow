# CLAUDE.MD - Development Guide for CEO Command Center

This document provides comprehensive guidelines for AI assistants and developers working on the CEO Command Center project.

---

## TYPESCRIPT RULES

### Strict Mode
- Always use TypeScript strict mode
- No `any` types (use `unknown` if needed)
- Explicit return types on functions
- Proper null checking

### Examples

```typescript
// ❌ Bad
async function getTasks(userId) {
  const tasks = await prisma.task.findMany({
    where: { userId }
  })
  return tasks
}

// ✅ Good
async function getTasks(userId: string): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    where: { userId }
  })
  return tasks
}
```

### Type vs Interface
```typescript
// Use types for data structures
type User = {
  id: string
  email: string
  name: string | null
}

// Use interfaces for extensible objects
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

---

## REACT COMPONENT PATTERNS

### Server Components (Default in App Router)

```typescript
// app/dashboard/page.tsx
import { getTasks } from '@/lib/tasks'
import { getServerSession } from 'next-auth'

export default async function DashboardPage() {
  const session = await getServerSession()
  const tasks = await getTasks(session.user.id)

  return (
    <div>
      <h1>Dashboard</h1>
      <TaskList tasks={tasks} />
    </div>
  )
}
```

### Client Components (Interactive)

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type TaskFormProps = {
  onSubmit: (title: string) => Promise<void>
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(title)
      setTitle('')
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  )
}
```

### Component File Structure

```
TaskList/
├── index.ts          # Export component
├── TaskList.tsx      # Main component
├── TaskItem.tsx      # Sub-component
└── types.ts          # Component-specific types
```

### Props Typing

```typescript
// Define props as a type
type TaskListProps = {
  tasks: Task[]
  onTaskComplete?: (taskId: string) => void
  variant?: 'default' | 'compact'
}

export function TaskList({
  tasks,
  onTaskComplete,
  variant = 'default'
}: TaskListProps) {
  // Component code
}
```

---

## API ROUTE PATTERNS

### Standard Structure

```typescript
// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schema
const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.enum(['P0_CRITICAL', 'P1_HIGH', 'P2_MEDIUM', 'P3_LOW']).optional(),
  dueDate: z.string().datetime().optional()
})

// GET handler
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = createTaskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        ...validated,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true, task }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('POST /api/tasks error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Dynamic Route Parameters

```typescript
// app/api/tasks/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Verify task belongs to user
  const existingTask = await prisma.task.findUnique({
    where: { id: params.id },
    select: { userId: true }
  })

  if (!existingTask || existingTask.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: body
  })

  return NextResponse.json({ success: true, task: updatedTask })
}
```

---

## ERROR HANDLING

### Try-Catch Pattern

```typescript
try {
  const result = await someOperation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)

  if (error instanceof SomeSpecificError) {
    return { success: false, error: 'User-friendly message' }
  }

  return { success: false, error: 'Something went wrong' }
}
```

### Client-Side Error Boundaries

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
```

---

## DATABASE PATTERNS

### Use Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Query Patterns

```typescript
// ✅ Good - specific fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    subscriptionStatus: true
  }
})

// ❌ Bad - returning password hash
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// ✅ Good - efficient relationships
const tasks = await prisma.task.findMany({
  where: { userId },
  include: {
    project: {
      select: {
        id: true,
        name: true,
        color: true
      }
    }
  }
})
```

### Transactions

```typescript
await prisma.$transaction(async (tx) => {
  // Update task
  await tx.task.update({
    where: { id: taskId },
    data: { status: 'DONE' }
  })

  // Update project progress
  const project = await tx.project.findUnique({
    where: { id: projectId },
    include: { tasks: true }
  })

  const completedCount = project.tasks.filter(t => t.status === 'DONE').length
  const progress = Math.round((completedCount / project.tasks.length) * 100)

  await tx.project.update({
    where: { id: projectId },
    data: { progress }
  })
})
```

---

## VALIDATION

### Use Zod for All Input

```typescript
import { z } from 'zod'

// Define schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['P0_CRITICAL', 'P1_HIGH', 'P2_MEDIUM', 'P3_LOW']).default('P2_MEDIUM'),
  projectId: z.string().cuid().optional()
})

// Usage - throws on invalid
const validated = taskSchema.parse(input)

// Usage - safe parse
const result = taskSchema.safeParse(input)
if (!result.success) {
  return { error: result.error.errors }
}
const validated = result.data
```

### Form Validation

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    // Handle login
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## AUTHENTICATION

### Protect API Routes

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Protected logic here
}
```

### Protect Pages

```typescript
// app/(dashboard)/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  // Page content
  return <div>Dashboard</div>
}
```

### Layout-Level Protection

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

---

## SUBSCRIPTION CHECKING

### Utility Functions

```typescript
// lib/subscription.ts
import { SubscriptionStatus } from '@prisma/client'
import { prisma } from './prisma'

export function isPro(subscriptionStatus: SubscriptionStatus): boolean {
  return subscriptionStatus === 'ACTIVE' || subscriptionStatus === 'TRIALING'
}

export async function checkSubscriptionAccess(
  userId: string,
  feature: 'tasks' | 'projects' | 'habits' | 'energy' | 'review'
): Promise<{ allowed: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true }
  })

  if (!user) {
    return { allowed: false, reason: 'User not found' }
  }

  if (isPro(user.subscriptionStatus)) {
    return { allowed: true }
  }

  // Free tier limits
  if (feature === 'tasks') {
    const taskCount = await prisma.task.count({
      where: { userId }
    })
    if (taskCount >= 10) {
      return { allowed: false, reason: 'Free tier limited to 10 tasks. Upgrade to Pro for unlimited.' }
    }
  }

  if (feature === 'projects') {
    const projectCount = await prisma.project.count({
      where: { userId, status: 'ACTIVE' }
    })
    if (projectCount >= 1) {
      return { allowed: false, reason: 'Free tier limited to 1 active project. Upgrade to Pro for unlimited.' }
    }
  }

  if (feature === 'energy' || feature === 'review') {
    return { allowed: false, reason: 'This feature requires Pro. Upgrade to unlock.' }
  }

  return { allowed: true }
}
```

---

## LOADING STATES

### Suspense Boundaries

```typescript
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList />
      </Suspense>
    </div>
  )
}

function TaskListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}
```

---

## NAMING CONVENTIONS

### Files
- Components: `PascalCase.tsx` (TaskList.tsx)
- Utils: `kebab-case.ts` (date-utils.ts)
- API routes: `route.ts`
- Pages: `page.tsx`
- Layouts: `layout.tsx`

### Variables & Functions
```typescript
// camelCase for variables and functions
const userTasks = []
function calculateProgress() {}

// PascalCase for components and types
type Task = {}
function TaskList() {}

// SCREAMING_SNAKE_CASE for constants
const MAX_TASKS_FREE_TIER = 10
const API_BASE_URL = 'https://api.example.com'

// Prefix booleans
const isActive = true
const hasPermission = false
const shouldShowModal = false

// Prefix handlers
function handleClick() {}
function handleSubmit() {}

// Prefix async functions clearly
async function fetchUserData() {}
async function createTask() {}
```

---

## COMMENTS

### When to Comment
- Complex business logic
- Non-obvious workarounds
- Important context
- API integrations

### When NOT to Comment
- Self-explanatory code
- Redundant information

```typescript
// ❌ Bad comment - redundant
// Get the user by ID
const user = await getUserById(id)

// ✅ Good comment - explains why
// Using raw query because Prisma doesn't support this aggregation yet
const result = await prisma.$queryRaw`
  SELECT DATE(created_at) as date, COUNT(*) as count
  FROM tasks
  GROUP BY DATE(created_at)
`

// ✅ Good comment - business context
// Free tier users are limited to 10 tasks
// This check prevents them from creating more
if (!isPro && taskCount >= 10) {
  throw new Error('Task limit reached')
}
```

---

## PERFORMANCE OPTIMIZATION

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
  priority={false}  // Lazy load by default
/>
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false  // Don't render on server
})
```

### Database Query Optimization

```typescript
// ✅ Use indexes (defined in Prisma schema)
@@index([userId, status])
@@index([userId, dueDate])

// ✅ Select only needed fields
const tasks = await prisma.task.findMany({
  select: {
    id: true,
    title: true,
    status: true
  }
})

// ✅ Batch queries with Promise.all
const [tasks, projects, habits] = await Promise.all([
  prisma.task.findMany({ where: { userId } }),
  prisma.project.findMany({ where: { userId } }),
  prisma.habit.findMany({ where: { userId } })
])
```

---

## COMMIT MESSAGES

### Format
```
type(scope): description

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### Examples
```
feat(tasks): add drag-and-drop reordering
fix(auth): resolve session expiry issue
docs(api): update endpoint documentation
refactor(dashboard): simplify stats calculation
style(ui): improve mobile responsiveness
```

---

## KEY PRINCIPLES

1. **Type Safety**: Always use TypeScript, never use `any`
2. **Validation**: Validate all user input with Zod
3. **Security**: Check authentication/authorization on every protected route
4. **Performance**: Use Server Components by default, Client only when needed
5. **Error Handling**: Always handle errors gracefully, never expose internal details
6. **Testing**: Write tests for critical business logic (post-MVP)
7. **Logging**: Log important events and errors for debugging
8. **Documentation**: Comment complex logic, keep guides updated

---

## QUICK REFERENCE COMMANDS

```bash
# Development
npm run dev                     # Start dev server

# Database
npm run db:generate             # Generate Prisma Client
npm run db:migrate              # Create and apply migration
npm run db:push                 # Push schema changes (dev)
npm run db:studio               # Open Prisma Studio

# Build
npm run build                   # Build for production
npm run start                   # Start production server

# Linting
npm run lint                    # Run ESLint
```

---

**Last Updated:** 2025-10-27
**Version:** 1.0
