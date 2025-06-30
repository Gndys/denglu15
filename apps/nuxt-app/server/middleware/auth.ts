/**
 * Server-side authentication middleware for API routes
 * Provides basic authentication checking for protected API endpoints
 */

interface ProtectedApiRoute {
  pattern: RegExp
  requiresAuth: boolean
}

// Define protected API routes (simplified version)
const protectedApiRoutes: ProtectedApiRoute[] = [
  // Admin API routes
  {
    pattern: /^\/api\/admin(\/.*)?$/,
    requiresAuth: true
  },
  
  // Chat API
  {
    pattern: /^\/api\/chat(\/.*)?$/,
    requiresAuth: true
  },
  
  // Premium API routes
  {
    pattern: /^\/api\/premium(\/.*)?$/,
    requiresAuth: true
  },

  // User API routes
  {
    pattern: /^\/api\/users(\/.*)?$/,
    requiresAuth: true
  }
]

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  // Skip authentication for public API routes
  if (pathname.startsWith('/api/auth/') || 
      pathname.startsWith('/api/payment/webhook/') ||
      pathname === '/api/orders' ||
      pathname === '/api/subscription/status') {
    return
  }

  // Find matching protected API route
  const matchedRoute = protectedApiRoutes.find(route => route.pattern.test(pathname))
  
  if (!matchedRoute?.requiresAuth) {
    return // No authentication needed
  }

  console.log(`Protected API route accessed: ${pathname}`)

  try {
    // Import auth here to avoid import issues
    const { auth } = await import('@libs/auth')
    
    const session = await auth.api.getSession({
      headers: new Headers(getHeaders(event) as HeadersInit)
    })

    if (!session?.user) {
      console.log(`Authentication failed for API: ${pathname}`)
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Store user in event context for later use in API handlers
    event.context.user = session.user
    console.log(`Authentication successful for API: ${pathname}, User: ${session.user.id}`)

  } catch (error: any) {
    // Re-throw HTTP errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle other errors
    console.error('Auth middleware error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
}) 