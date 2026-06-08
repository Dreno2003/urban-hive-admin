import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT those beginning with:
     * - _next (internal Next.js files)
     * - api  (API routes)
     * - Files with dots (e.g. favicon.ico, images)
     */
    '/((?!_next|api|.*\\..*).*)',
  ],
}
