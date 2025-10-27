import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  priority: z.enum(['P0_CRITICAL', 'P1_HIGH', 'P2_MEDIUM', 'P3_LOW']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'WAITING', 'DONE', 'CANCELED']).optional(),
  projectId: z.string().cuid().optional(),
  context: z.enum(['DEEP_WORK', 'CALLS', 'EMAIL', 'ADMIN', 'CREATIVE', 'PHYSICAL']).optional(),
  energy: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  dueDate: z.string().datetime().optional(),
  estimatedMins: z.number().min(1).max(480).optional(),
  tags: z.array(z.string()).optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
