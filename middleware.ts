import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/deals', '/reports', '/team', '/settings']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    path === route || path.startsWith(route + '/')
  )

  // Protected routes - require authentication
  if (isProtectedRoute) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Auth routes - redirect to dashboard if already logged in
  if (path === '/login' || path === '/signup') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/deals/:path*', '/reports/:path*', '/team/:path*', '/settings/:path*', '/login', '/signup', '/forgot-password', '/reset-password'],
}
