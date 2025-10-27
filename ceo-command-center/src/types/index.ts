import { Task, Project, Goal, Habit, User, SubscriptionStatus } from '@prisma/client'

export type {
  Task,
  Project,
  Goal,
  Habit,
  User,
  SubscriptionStatus,
  TaskStatus,
  Priority,
  Context,
  EnergyLevel,
  ProjectStatus,
  ProjectCategory,
  GoalStatus,
  GoalTimeframe,
  HabitCategory,
  HabitFrequency,
  TimeOfDay,
} from '@prisma/client'

export type TaskWithProject = Task & {
  project?: {
    id: string
    name: string
    color: string
  } | null
}

export type ProjectWithTasks = Project & {
  tasks: Task[]
  _count?: {
    tasks: number
  }
}

export type GoalWithProjects = Goal & {
  projects: Project[]
}

export type HabitWithLogs = Habit & {
  logs: {
    id: string
    date: Date
    completed: boolean
  }[]
}

export type ApiResponse<T = unknown> = {
  success: true
  data: T
} | {
  success: false
  error: string
  details?: unknown
}

export type DashboardStats = {
  tasksToday: number
  tasksCompleted: number
  activeProjects: number
  currentStreak: number
  weekProgress: number
}
