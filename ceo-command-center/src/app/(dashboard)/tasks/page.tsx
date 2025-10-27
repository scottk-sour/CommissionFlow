'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  dueDate?: string | null
  project?: {
    id: string
    name: string
    color: string
  } | null
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks)
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      })

      const data = await response.json()

      if (data.success) {
        setTasks([data.task, ...tasks])
        setNewTaskTitle('')
      } else {
        setError(data.error || 'Failed to create task')
      }
    } catch (err) {
      setError('Failed to create task')
    } finally {
      setIsCreating(false)
    }
  }

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE'

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setTasks(tasks.map(t => t.id === task.id ? data.task : t))
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const todoTasks = tasks.filter(t => t.status !== 'DONE')
  const doneTasks = tasks.filter(t => t.status === 'DONE')

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-2">
            Manage your to-do list and get things done
          </p>
        </div>
      </div>

      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createTask} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </form>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Todo Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">To Do ({todoTasks.length})</h2>
        <div className="space-y-2">
          {todoTasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No tasks yet. Add one above to get started!
              </CardContent>
            </Card>
          ) : (
            todoTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <button
                    onClick={() => toggleTask(task)}
                    className="flex-shrink-0"
                  >
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Done Tasks */}
      {doneTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed ({doneTasks.length})</h2>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="flex items-center gap-4 py-4">
                  <button
                    onClick={() => toggleTask(task)}
                    className="flex-shrink-0"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium line-through">{task.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
