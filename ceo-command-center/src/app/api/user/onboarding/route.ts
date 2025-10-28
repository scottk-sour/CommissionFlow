import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { startOfDay, addDays } from 'date-fns'

const completeOnboardingSchema = z.object({
  createSampleData: z.boolean().default(false),
})

// POST /api/user/onboarding - Mark onboarding as complete
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { createSampleData } = completeOnboardingSchema.parse(body)

    // Mark onboarding as complete
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true },
    })

    // Optionally create sample data
    if (createSampleData) {
      const today = startOfDay(new Date())

      // Create a sample project
      const sampleProject = await prisma.project.create({
        data: {
          userId: session.user.id,
          name: 'Launch Product V1',
          description: 'Build and launch the first version of our product',
          category: 'BUSINESS',
          priority: 'P1_HIGH',
          status: 'ACTIVE',
          startDate: today,
          targetEndDate: addDays(today, 90),
          color: '#3B82F6',
        },
      })

      // Create a sample goal
      const sampleGoal = await prisma.goal.create({
        data: {
          userId: session.user.id,
          name: 'Increase Revenue by 30%',
          description: 'Grow monthly recurring revenue to $100k',
          category: 'BUSINESS',
          timeframe: 'THIS_QUARTER',
          status: 'ON_TRACK',
          progress: 15,
          targetDate: addDays(today, 90),
          whyItMatters: 'Financial stability and ability to hire more team members',
          keyResults: [
            {
              id: '1',
              description: 'Acquire 50 new customers',
              target: 50,
              current: 12,
              unit: 'customers',
            },
            {
              id: '2',
              description: 'Increase average deal size',
              target: 2000,
              current: 1500,
              unit: '$',
            },
          ],
        },
      })

      // Link project to goal
      await prisma.project.update({
        where: { id: sampleProject.id },
        data: { goalId: sampleGoal.id },
      })

      // Create sample tasks
      await prisma.task.createMany({
        data: [
          {
            userId: session.user.id,
            projectId: sampleProject.id,
            title: 'Design landing page mockups',
            description: 'Create wireframes and high-fidelity designs for the landing page',
            status: 'DONE',
            priority: 'P0_CRITICAL',
            context: 'CREATIVE',
            energy: 'HIGH',
            dueDate: addDays(today, -2),
            completedAt: addDays(today, -2),
          },
          {
            userId: session.user.id,
            projectId: sampleProject.id,
            title: 'Implement user authentication',
            description: 'Set up NextAuth with email/password and OAuth',
            status: 'IN_PROGRESS',
            priority: 'P0_CRITICAL',
            context: 'DEEP_WORK',
            energy: 'HIGH',
            dueDate: addDays(today, 3),
          },
          {
            userId: session.user.id,
            projectId: sampleProject.id,
            title: 'Write API documentation',
            description: 'Document all API endpoints with examples',
            status: 'TODO',
            priority: 'P2_MEDIUM',
            context: 'ADMIN',
            energy: 'MEDIUM',
            dueDate: addDays(today, 7),
          },
          {
            userId: session.user.id,
            title: 'Review quarterly goals',
            description: 'Reflect on progress and adjust goals for next quarter',
            status: 'TODO',
            priority: 'P1_HIGH',
            context: 'DEEP_WORK',
            energy: 'HIGH',
            dueDate: addDays(today, 1),
          },
        ],
      })

      // Create a sample habit
      const sampleHabit = await prisma.habit.create({
        data: {
          userId: session.user.id,
          name: 'Morning exercise',
          description: '30 minutes of cardio or strength training',
          category: 'HEALTH',
          frequency: 'DAILY',
          timeOfDay: 'MORNING',
          whyImportant: 'Improves energy, focus, and overall health',
          currentStreak: 3,
          bestStreak: 7,
        },
      })

      // Create habit logs for the last 3 days
      await prisma.habitLog.createMany({
        data: [
          {
            userId: session.user.id,
            habitId: sampleHabit.id,
            date: addDays(today, -2),
          },
          {
            userId: session.user.id,
            habitId: sampleHabit.id,
            date: addDays(today, -1),
          },
          {
            userId: session.user.id,
            habitId: sampleHabit.id,
            date: today,
          },
        ],
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed',
      sampleDataCreated: createSampleData,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error completing onboarding:', error)
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 })
  }
}
