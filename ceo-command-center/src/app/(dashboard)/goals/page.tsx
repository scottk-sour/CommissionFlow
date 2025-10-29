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
import { Plus, Target, MoreVertical, Pencil, Trash2, TrendingUp, X } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'

type KeyResult = {
  id: string
  description: string
  target: number
  current: number
  unit: string
}

type Goal = {
  id: string
  name: string
  description: string | null
  category: string
  timeframe: string
  status: string
  progress: number
  targetDate: string | null
  whyItMatters: string | null
  keyResults: KeyResult[]
  _count: { projects: number }
}

const CATEGORIES = [
  { value: 'BUSINESS', label: 'Business' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'LEARNING', label: 'Learning' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'CREATIVE', label: 'Creative' },
  { value: 'OTHER', label: 'Other' },
]

const TIMEFRAMES = [
  { value: 'THIS_QUARTER', label: 'This Quarter' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'THREE_YEAR', label: '3 Years' },
  { value: 'FIVE_YEAR', label: '5 Years' },
]

const STATUSES = [
  { value: 'ON_TRACK', label: 'On Track', color: 'bg-green-500' },
  { value: 'AT_RISK', label: 'At Risk', color: 'bg-yellow-500' },
  { value: 'BEHIND', label: 'Behind', color: 'bg-orange-500' },
  { value: 'ACHIEVED', label: 'Achieved', color: 'bg-blue-500' },
  { value: 'ABANDONED', label: 'Abandoned', color: 'bg-gray-500' },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'BUSINESS',
    timeframe: 'THIS_QUARTER',
    status: 'ON_TRACK',
    progress: 0,
    targetDate: '',
    whyItMatters: '',
    keyResults: [] as KeyResult[],
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      const data = await response.json()
      if (data.success) {
        setGoals(data.data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingGoal ? `/api/goals/${editingGoal.id}` : '/api/goals'
      const method = editingGoal ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchGoals()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving goal:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await fetch(`/api/goals/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchGoals()
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      description: goal.description || '',
      category: goal.category,
      timeframe: goal.timeframe,
      status: goal.status,
      progress: goal.progress,
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
      whyItMatters: goal.whyItMatters || '',
      keyResults: goal.keyResults || [],
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingGoal(null)
    setFormData({
      name: '',
      description: '',
      category: 'BUSINESS',
      timeframe: 'THIS_QUARTER',
      status: 'ON_TRACK',
      progress: 0,
      targetDate: '',
      whyItMatters: '',
      keyResults: [],
    })
  }

  const addKeyResult = () => {
    setFormData({
      ...formData,
      keyResults: [
        ...formData.keyResults,
        {
          id: Date.now().toString(),
          description: '',
          target: 100,
          current: 0,
          unit: '%',
        },
      ],
    })
  }

  const removeKeyResult = (id: string) => {
    setFormData({
      ...formData,
      keyResults: formData.keyResults.filter((kr) => kr.id !== id),
    })
  }

  const updateKeyResult = (id: string, field: keyof KeyResult, value: any) => {
    setFormData({
      ...formData,
      keyResults: formData.keyResults.map((kr) =>
        kr.id === id ? { ...kr, [field]: value } : kr
      ),
    })
  }

  const getStatusBadge = (status: string) => {
    const statusObj = STATUSES.find((s) => s.value === status)
    return (
      <Badge className={`${statusObj?.color} text-white`}>
        {statusObj?.label || status}
      </Badge>
    )
  }

  const calculateKeyResultProgress = (keyResults: KeyResult[]) => {
    if (!keyResults || keyResults.length === 0) return 0
    const avgProgress = keyResults.reduce((sum, kr) => {
      const krProgress = (kr.current / kr.target) * 100
      return sum + Math.min(krProgress, 100)
    }, 0) / keyResults.length
    return Math.round(avgProgress)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading goals...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground mt-2">
            Set and track your quarterly and annual objectives
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No goals yet</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Create your first goal with key results to track meaningful progress.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const krProgress = calculateKeyResultProgress(goal.keyResults)
            return (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(goal)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {goal.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Timeframe:</span>
                    <Badge variant="outline">
                      {TIMEFRAMES.find((t) => t.value === goal.timeframe)?.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(goal.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                  {goal.keyResults && goal.keyResults.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Key Results:</div>
                      {goal.keyResults.slice(0, 2).map((kr) => (
                        <div key={kr.id} className="text-xs text-muted-foreground">
                          <div className="flex justify-between mb-1">
                            <span className="truncate">{kr.description}</span>
                            <span className="ml-2 whitespace-nowrap">
                              {kr.current}/{kr.target} {kr.unit}
                            </span>
                          </div>
                          <Progress value={(kr.current / kr.target) * 100} className="h-1" />
                        </div>
                      ))}
                      {goal.keyResults.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{goal.keyResults.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  {goal._count.projects > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      {goal._count.projects} linked project{goal._count.projects !== 1 ? 's' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </DialogTitle>
            <DialogDescription>
              {editingGoal ? 'Update goal details and key results' : 'Define a new goal with measurable key results'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Goal Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Increase revenue by 30%"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="whyItMatters">Why It Matters</Label>
              <Textarea
                id="whyItMatters"
                value={formData.whyItMatters}
                onChange={(e) => setFormData({ ...formData, whyItMatters: e.target.value })}
                placeholder="Why is this goal important to you?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={formData.timeframe} onValueChange={(v) => setFormData({ ...formData, timeframe: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAMES.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key Results</Label>
                <Button type="button" size="sm" variant="outline" onClick={addKeyResult}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Key Result
                </Button>
              </div>
              {formData.keyResults.map((kr, index) => (
                <Card key={kr.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Input
                        placeholder="Key result description"
                        value={kr.description}
                        onChange={(e) => updateKeyResult(kr.id, 'description', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeKeyResult(kr.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        placeholder="Current"
                        value={kr.current}
                        onChange={(e) => updateKeyResult(kr.id, 'current', parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        type="number"
                        placeholder="Target"
                        value={kr.target}
                        onChange={(e) => updateKeyResult(kr.id, 'target', parseFloat(e.target.value) || 100)}
                      />
                      <Input
                        placeholder="Unit"
                        value={kr.unit}
                        onChange={(e) => updateKeyResult(kr.id, 'unit', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
