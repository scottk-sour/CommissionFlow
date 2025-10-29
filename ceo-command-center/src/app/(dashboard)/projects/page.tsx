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
import { Plus, FolderKanban, MoreVertical, Pencil, Trash2, Target } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'

type Project = {
  id: string
  name: string
  description: string | null
  category: string
  priority: string
  status: string
  color: string
  startDate: string | null
  targetEndDate: string | null
  progress: number
  taskCount: number
  completedTaskCount: number
  goal?: { id: string; name: string } | null
}

const CATEGORIES = [
  { value: 'BUSINESS', label: 'Business' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'LEARNING', label: 'Learning' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'CREATIVE', label: 'Creative' },
  { value: 'OTHER', label: 'Other' },
]

const PRIORITIES = [
  { value: 'P0_CRITICAL', label: 'P0 - Critical', color: 'text-red-600' },
  { value: 'P1_HIGH', label: 'P1 - High', color: 'text-orange-600' },
  { value: 'P2_MEDIUM', label: 'P2 - Medium', color: 'text-yellow-600' },
  { value: 'P3_LOW', label: 'P3 - Low', color: 'text-green-600' },
]

const STATUSES = [
  { value: 'PLANNING', label: 'Planning', color: 'bg-gray-500' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-blue-500' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'bg-yellow-500' },
  { value: 'COMPLETE', label: 'Complete', color: 'bg-green-500' },
  { value: 'CANCELED', label: 'Canceled', color: 'bg-red-500' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'BUSINESS',
    priority: 'P2_MEDIUM',
    status: 'ACTIVE',
    color: '#3B82F6',
    startDate: '',
    targetEndDate: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProjects()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || '',
      category: project.category,
      priority: project.priority,
      status: project.status,
      color: project.color,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      targetEndDate: project.targetEndDate ? project.targetEndDate.split('T')[0] : '',
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      category: 'BUSINESS',
      priority: 'P2_MEDIUM',
      status: 'ACTIVE',
      color: '#3B82F6',
      startDate: '',
      targetEndDate: '',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusObj = STATUSES.find(s => s.value === status)
    return (
      <Badge className={`${statusObj?.color} text-white`}>
        {statusObj?.label || status}
      </Badge>
    )
  }

  const getPriorityDisplay = (priority: string) => {
    const priorityObj = PRIORITIES.find(p => p.value === priority)
    return (
      <span className={priorityObj?.color}>
        {priorityObj?.label.split(' - ')[0] || priority}
      </span>
    )
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Organize tasks into projects and track progress
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Create your first project to organize tasks and track progress effectively.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(project)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority:</span>
                  {getPriorityDisplay(project.priority)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                  <div className="text-xs text-muted-foreground text-center">
                    {project.completedTaskCount} of {project.taskCount} tasks completed
                  </div>
                </div>
                {project.goal && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span className="truncate">{project.goal.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project details' : 'Add a new project to organize your tasks'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My New Project"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                rows={3}
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
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((pri) => (
                      <SelectItem key={pri.value} value={pri.value}>
                        {pri.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="targetEndDate">Target End Date</Label>
                <Input
                  id="targetEndDate"
                  type="date"
                  value={formData.targetEndDate}
                  onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
