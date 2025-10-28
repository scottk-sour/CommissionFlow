'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Calendar, MoreVertical, Pencil, Trash2, Flame, TrendingUp } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format, subDays, startOfDay, isSameDay } from 'date-fns'

type HabitLog = {
  id: string
  date: string
  notes: string | null
}

type Habit = {
  id: string
  name: string
  description: string | null
  category: string
  frequency: string
  timeOfDay: string | null
  currentStreak: number
  bestStreak: number
  active: boolean
  logs: HabitLog[]
}

const CATEGORIES = [
  { value: 'HEALTH', label: 'Health' },
  { value: 'PRODUCTIVITY', label: 'Productivity' },
  { value: 'LEARNING', label: 'Learning' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CREATIVE', label: 'Creative' },
  { value: 'OTHER', label: 'Other' },
]

const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKDAY', label: 'Weekdays' },
  { value: 'WEEKEND', label: 'Weekends' },
  { value: 'WEEKLY', label: 'Weekly' },
]

const TIME_OF_DAY = [
  { value: 'MORNING', label: 'Morning' },
  { value: 'AFTERNOON', label: 'Afternoon' },
  { value: 'EVENING', label: 'Evening' },
  { value: 'ANYTIME', label: 'Anytime' },
]

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'HEALTH',
    frequency: 'DAILY',
    timeOfDay: 'ANYTIME',
    whyImportant: '',
    active: true,
  })

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits?active=true')
      const data = await response.json()
      if (data.success) {
        setHabits(data.data)
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingHabit ? `/api/habits/${editingHabit.id}` : '/api/habits'
      const method = editingHabit ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchHabits()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving habit:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      const response = await fetch(`/api/habits/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchHabits()
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const toggleHabitLog = async (habitId: string, date: Date) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: format(date, 'yyyy-MM-dd') }),
      })

      if (response.ok) {
        await fetchHabits()
      }
    } catch (error) {
      console.error('Error toggling habit log:', error)
    }
  }

  const isHabitLoggedForDate = (habit: Habit, date: Date) => {
    return habit.logs.some((log) => isSameDay(new Date(log.date), date))
  }

  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description || '',
      category: habit.category,
      frequency: habit.frequency,
      timeOfDay: habit.timeOfDay || 'ANYTIME',
      whyImportant: '',
      active: habit.active,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingHabit(null)
    setFormData({
      name: '',
      description: '',
      category: 'HEALTH',
      frequency: 'DAILY',
      timeOfDay: 'ANYTIME',
      whyImportant: '',
      active: true,
    })
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      days.push(subDays(startOfDay(new Date()), i))
    }
    return days
  }

  const last7Days = getLast7Days()

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading habits...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-muted-foreground mt-2">
            Build consistency with daily habit tracking
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No habits yet</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Create your first habit to start building consistency and tracking progress.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <Card key={habit.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <Badge variant="outline">{CATEGORIES.find(c => c.value === habit.category)?.label}</Badge>
                      {habit.timeOfDay && (
                        <Badge variant="secondary" className="text-xs">
                          {TIME_OF_DAY.find(t => t.value === habit.timeOfDay)?.label}
                        </Badge>
                      )}
                    </div>
                    {habit.description && (
                      <CardDescription className="mt-1">{habit.description}</CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(habit)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(habit.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  {/* Streak Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-2xl font-bold">{habit.currentStreak}</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{habit.bestStreak}</div>
                        <div className="text-xs text-muted-foreground">Best</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-12 w-px bg-border" />

                  {/* Last 7 Days */}
                  <div className="flex-1">
                    <div className="grid grid-cols-7 gap-2">
                      {last7Days.map((date) => {
                        const isLogged = isHabitLoggedForDate(habit, date)
                        const isToday = isSameDay(date, new Date())
                        return (
                          <div key={date.toISOString()} className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">
                              {format(date, 'EEE')}
                            </div>
                            <div
                              className={`flex items-center justify-center h-10 w-10 rounded-md cursor-pointer transition-colors mx-auto ${
                                isLogged
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-muted hover:bg-muted/80'
                              } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                              onClick={() => toggleHabitLog(habit.id, date)}
                            >
                              {isLogged && (
                                <Checkbox
                                  checked={true}
                                  className="pointer-events-none border-white"
                                />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(date, 'd')}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </DialogTitle>
            <DialogDescription>
              {editingHabit ? 'Update habit details' : 'Add a new habit to track daily'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Habit Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Exercise for 30 minutes"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this habit involve?"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="whyImportant">Why It's Important</Label>
              <Textarea
                id="whyImportant"
                value={formData.whyImportant}
                onChange={(e) => setFormData({ ...formData, whyImportant: e.target.value })}
                placeholder="Why is this habit meaningful to you?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Select value={formData.timeOfDay} onValueChange={(v) => setFormData({ ...formData, timeOfDay: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OF_DAY.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingHabit ? 'Update Habit' : 'Create Habit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
