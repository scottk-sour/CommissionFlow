import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type Task = {
  id: string
  title: string
  priority: string
  dueDate: Date | null
  status: string
  project?: {
    name: string
    color: string
  } | null
}

type Habit = {
  id: string
  name: string
  category: string
  currentStreak: number
}

type Stats = {
  totalStreakDays: number
  activeProjects: number
  completionRate: number
}

type DailyDigestEmailProps = {
  userName: string
  tasksDueToday: Task[]
  overdueTasks: Task[]
  habitsToday: Habit[]
  stats: Stats
  appUrl: string
}

const priorityColors: Record<string, string> = {
  P0_CRITICAL: '#EF4444',
  P1_HIGH: '#F59E0B',
  P2_MEDIUM: '#3B82F6',
  P3_LOW: '#6B7280',
}

const priorityLabels: Record<string, string> = {
  P0_CRITICAL: 'P0',
  P1_HIGH: 'P1',
  P2_MEDIUM: 'P2',
  P3_LOW: 'P3',
}

export default function DailyDigestEmail({
  userName,
  tasksDueToday,
  overdueTasks,
  habitsToday,
  stats,
  appUrl,
}: DailyDigestEmailProps) {
  const hasContent = tasksDueToday.length > 0 || overdueTasks.length > 0 || habitsToday.length > 0

  return (
    <Html>
      <Head />
      <Preview>
        {hasContent
          ? `${tasksDueToday.length} tasks due today${overdueTasks.length > 0 ? `, ${overdueTasks.length} overdue` : ''}`
          : 'Your daily shop summary'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Heading style={h1}>Good morning, {userName}! ☀️</Heading>
          <Text style={text}>Here's your daily shop summary</Text>

          {/* Stats Bar */}
          <Section style={statsContainer}>
            <table style={{ width: '100%', textAlign: 'center' }}>
              <tr>
                <td style={statCell}>
                  <Text style={statNumber}>{stats.totalStreakDays}</Text>
                  <Text style={statLabel}>Total Streak Days</Text>
                </td>
                <td style={statCell}>
                  <Text style={statNumber}>{stats.activeProjects}</Text>
                  <Text style={statLabel}>Active Projects</Text>
                </td>
                <td style={statCell}>
                  <Text style={statNumber}>{stats.completionRate}%</Text>
                  <Text style={statLabel}>Completion Rate</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Overdue Tasks (if any) */}
          {overdueTasks.length > 0 && (
            <>
              <Heading style={h2}>⚠️ Overdue Tasks ({overdueTasks.length})</Heading>
              <Section style={taskSection}>
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task.id} style={taskCard}>
                    <div style={taskHeader}>
                      <span
                        style={{
                          ...priorityBadge,
                          backgroundColor: priorityColors[task.priority] || '#6B7280',
                        }}
                      >
                        {priorityLabels[task.priority] || 'P2'}
                      </span>
                      <Text style={taskTitle}>{task.title}</Text>
                    </div>
                    {task.project && (
                      <Text style={taskProject}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: task.project.color,
                            marginRight: '6px',
                          }}
                        />
                        {task.project.name}
                      </Text>
                    )}
                  </div>
                ))}
              </Section>
              <Hr style={hr} />
            </>
          )}

          {/* Tasks Due Today */}
          {tasksDueToday.length > 0 ? (
            <>
              <Heading style={h2}>✅ Tasks Due Today ({tasksDueToday.length})</Heading>
              <Section style={taskSection}>
                {tasksDueToday.slice(0, 5).map((task) => (
                  <div key={task.id} style={taskCard}>
                    <div style={taskHeader}>
                      <span
                        style={{
                          ...priorityBadge,
                          backgroundColor: priorityColors[task.priority] || '#6B7280',
                        }}
                      >
                        {priorityLabels[task.priority] || 'P2'}
                      </span>
                      <Text style={taskTitle}>{task.title}</Text>
                    </div>
                    {task.project && (
                      <Text style={taskProject}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: task.project.color,
                            marginRight: '6px',
                          }}
                        />
                        {task.project.name}
                      </Text>
                    )}
                  </div>
                ))}
              </Section>
            </>
          ) : (
            <>
              <Heading style={h2}>✅ Tasks Due Today</Heading>
              <Text style={text}>No tasks due today. Great job staying ahead!</Text>
            </>
          )}

          <Hr style={hr} />

          {/* Habits Today */}
          {habitsToday.length > 0 ? (
            <>
              <Heading style={h2}>🎯 Today's Habits ({habitsToday.length})</Heading>
              <Section>
                {habitsToday.map((habit) => (
                  <div key={habit.id} style={habitCard}>
                    <Text style={habitName}>{habit.name}</Text>
                    {habit.currentStreak > 0 && (
                      <Text style={habitStreak}>🔥 {habit.currentStreak} day streak</Text>
                    )}
                  </div>
                ))}
              </Section>
            </>
          ) : (
            <>
              <Heading style={h2}>🎯 Today's Habits</Heading>
              <Text style={text}>No habits tracked yet. Build consistency by adding your first habit!</Text>
            </>
          )}

          <Hr style={hr} />

          {/* CTA */}
          <Section style={buttonContainer}>
            <Link href={`${appUrl}/dashboard`} style={button}>
              Open Your Dashboard →
            </Link>
          </Section>

          {/* Footer */}
          <Text style={footer}>
            You're receiving this because you enabled daily digest emails.{' '}
            <Link href={`${appUrl}/settings`} style={link}>
              Update preferences
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
}

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  padding: '0 40px',
}

const text = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 40px',
  margin: '0 0 10px',
}

const statsContainer = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
}

const statCell = {
  padding: '10px',
}

const statNumber = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#3B82F6',
  margin: '0',
}

const statLabel = {
  fontSize: '12px',
  color: '#666',
  margin: '5px 0 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
}

const taskSection = {
  padding: '0 40px',
}

const taskCard = {
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  padding: '12px',
  marginBottom: '10px',
}

const taskHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const priorityBadge = {
  display: 'inline-block',
  color: '#ffffff',
  fontSize: '10px',
  fontWeight: 'bold',
  padding: '2px 6px',
  borderRadius: '4px',
  marginRight: '8px',
}

const taskTitle = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  display: 'inline',
}

const taskProject = {
  color: '#666',
  fontSize: '12px',
  margin: '4px 0 0',
}

const habitCard = {
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  padding: '12px',
  marginBottom: '10px',
  marginLeft: '40px',
  marginRight: '40px',
}

const habitName = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 4px',
}

const habitStreak = {
  color: '#666',
  fontSize: '12px',
  margin: '0',
}

const buttonContainer = {
  padding: '20px 40px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#3B82F6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const link = {
  color: '#3B82F6',
  textDecoration: 'underline',
}
