import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CEO Daily Command Center - Run Your Life Like a CEO",
  description: "Transform scattered to-do lists into a strategic life operating system. Save 2+ hours weekly on planning.",
  keywords: ["productivity", "task management", "goals", "habits", "planning"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
