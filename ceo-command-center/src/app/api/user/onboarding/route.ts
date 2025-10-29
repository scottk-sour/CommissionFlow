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

      // Create a sample project - Etsy focused
      const sampleProject = await prisma.project.create({
        data: {
          userId: session.user.id,
          name: 'Holiday Collection Launch',
          description: 'Design, photograph, and list new holiday-themed products',
          category: 'BUSINESS',
          priority: 'P1_HIGH',
          status: 'ACTIVE',
          startDate: today,
          targetEndDate: addDays(today, 45),
          color: '#EF4444',
        },
      })

      // Create a sample goal - Etsy revenue focused
      const sampleGoal = await prisma.goal.create({
        data: {
          userId: session.user.id,
          name: 'Hit $10k Monthly Revenue',
          description: 'Grow Etsy shop to $10,000 in monthly sales',
          category: 'BUSINESS',
          timeframe: 'THIS_QUARTER',
          status: 'ON_TRACK',
          progress: 40,
          targetDate: addDays(today, 90),
          whyItMatters: 'Reach full-time income from shop and quit day job',
          keyResults: [
            {
              id: '1',
              description: 'List 50 new products',
              target: 50,
              current: 18,
              unit: 'products',
            },
            {
              id: '2',
              description: 'Average $400/day in sales',
              target: 400,
              current: 180,
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

      // Create sample tasks - Etsy shop focused
      await prisma.task.createMany({
        data: [
          {
            userId: session.user.id,
            projectId: sampleProject.id,
            title: 'Design 5 new holiday ornament styles',
            description: 'Create sketches and finalize designs for winter ornament collection',
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
            title: 'Photograph products with holiday setup',
            description: 'Set up winter scene and photograph all 15 new products',
            status: 'IN_PROGRESS',
            priority: 'P0_CRITICAL',
            context: 'CREATIVE',
            energy: 'HIGH',
            dueDate: addDays(today, 2),
          },
          {
            userId: session.user.id,
            projectId: sampleProject.id,
            title: 'Write SEO-optimized product descriptions',
            description: 'Research keywords and write compelling descriptions for all new listings',
            status: 'TODO',
            priority: 'P1_HIGH',
            context: 'ADMIN',
            energy: 'MEDIUM',
            dueDate: addDays(today, 5),
          },
          {
            userId: session.user.id,
            title: 'Respond to customer messages',
            description: '3 pending messages about shipping times and custom orders',
            status: 'TODO',
            priority: 'P1_HIGH',
            context: 'EMAIL',
            energy: 'LOW',
            dueDate: addDays(today, 0),
          },
          {
            userId: session.user.id,
            title: 'Order packaging supplies',
            description: 'Restock: gift boxes, tissue paper, thank you cards',
            status: 'TODO',
            priority: 'P2_MEDIUM',
            context: 'ADMIN',
            energy: 'LOW',
            dueDate: addDays(today, 3),
          },
        ],
      })

      // Create a sample habit - Etsy shop focused
      const sampleHabit = await prisma.habit.create({
        data: {
          userId: session.user.id,
          name: 'List 1 new product daily',
          description: 'Create and publish at least one new Etsy listing every day',
          category: 'PRODUCTIVITY',
          frequency: 'DAILY',
          timeOfDay: 'MORNING',
          whyImportant: 'Consistent listings improve Etsy algorithm ranking and drive steady sales growth',
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
