'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WelcomeModal } from './WelcomeModal'

type OnboardingProviderProps = {
  children: React.ReactNode
  showOnboarding: boolean
}

export function OnboardingProvider({ children, showOnboarding }: OnboardingProviderProps) {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(showOnboarding)
  const router = useRouter()

  const handleOnboardingComplete = async (createSampleData: boolean) => {
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createSampleData }),
      })

      if (response.ok) {
        setIsOnboardingOpen(false)
        // Refresh the page to show the new data
        router.refresh()
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    }
  }

  return (
    <>
      <WelcomeModal isOpen={isOnboardingOpen} onComplete={handleOnboardingComplete} />
      {children}
    </>
  )
}
