import { auth } from '@libs/auth'
import { Action, Subject, can, createAppUser } from '@libs/permissions'

// Define the structure for protected API route configuration
interface ProtectedApiRouteConfig {
  pattern: RegExp
  // Permission required for access
  requiredPermission?: { 
    action: Action
    subject: Subject
  }
  requiresSubscription?: boolean
}

// Configuration for Protected API Routes
// Based on the Next.js authMiddleware.ts implementation
const protectedApiRoutes: ProtectedApiRouteConfig[] = [
  // Admin API routes - require admin permissions
  {
    pattern: /^\/api\/admin\/(.*)?$/,
    requiredPermission: { action: Action.MANAGE, subject: Subject.ALL }
  },
  
  // Chat API - require authentication
  {
    pattern: /^\/api\/chat(\/.*)?$/
    // Could add: requiredPermission: { action: Action.CREATE, subject: Subject.CHAT_MESSAGE }
  },
  
  // Premium API routes - require active subscription
  {
    pattern: /^\/api\/premium(\/.*)?$/,
    requiresSubscription: true
  },

  // User management APIs
  {
    pattern: /^\/api\/users(\/.*)?$/,
    requiredPermission: { action: Action.MANAGE, subject: Subject.ALL }
  },

  // Subscription management APIs
  {
    pattern: /^\/api\/subscription\/(cancel|upgrade|downgrade)(\/.*)?$/,
    // Users can manage their own subscriptions, admins can manage all
    // This will be handled in the specific route handlers
  }
]

/**
 * Check if user has valid subscription
 * This would integrate with the actual subscription service
 */
async function hasValidSubscription(userId: string): Promise<boolean> {
  // TODO: Implement actual subscription checking
  // For now, return true to allow access during development
  return true
  
  // Example implementation:
  // try {
  //   const subscription = await db.subscription.findFirst({
  //     where: {
  //       userId,
  //       status: 'active',
  //       expiresAt: { gt: new Date() }
  //     }
  //   })
  //   return !!subscription
  // } catch {
  //   return false
  // }
}

export default defineEventHandler(async (event) => {
  // Only process API routes
  if (!event.node.req.url?.startsWith('/api/')) {
    return
  }

  // Skip auth and webhook routes
  const skipRoutes = [
    '/api/auth/',
    '/api/payment/webhook/',
    '/api/health'
  ]
  
  if (skipRoutes.some(route => event.node.req.url?.startsWith(route))) {
    return
  }

  const url = event.node.req.url
  console.log(`API request: ${event.node.req.method} ${url}`)

  // Check if current route matches any protected route
  const matchedRoute = protectedApiRoutes.find(route => route.pattern.test(url))
  
  if (!matchedRoute) {
    return // Route is not protected
  }

  console.log(`Protected API route accessed: ${url}`)

  // Get user session
  const session = await auth.api.getSession({
    headers: new Headers(event.node.req.headers as HeadersInit)
  })
  
  // --- 1. Authentication Check ---
  if (!session || !session.user) {
    console.log(`Authentication failed for API: ${url}`)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // --- 2. Subscription Check (if required) ---
  if (matchedRoute.requiresSubscription) {
    console.log(`Subscription check for API: ${url}, User: ${session.user.id}`)
    
    const hasSubscription = await hasValidSubscription(session.user.id)
    console.log('hasSubscription', hasSubscription)
    
    if (!hasSubscription) {
      console.log(`Subscription check failed for API: ${url}, User: ${session.user.id}`)
      throw createError({
        statusCode: 402,
        statusMessage: 'Subscription required'
      })
    }
  }

  // --- 3. Authorization Check (RBAC-Based) ---
  console.log(`Authentication successful for API: ${url}, User: ${session.user.id}`)
  
  const requiredPermission = matchedRoute.requiredPermission
  
  if (requiredPermission) {
    // Create AppUser from session data
    const appUser = createAppUser(session.user)
    
    if (!appUser) {
      console.log(`Authorization failed (user object missing) for API: ${url}`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: User information missing'
      })
    }

    // Check permissions using RBAC system
    const hasPermission = can(appUser, requiredPermission.action, requiredPermission.subject)

    if (!hasPermission) {
      console.log(`Authorization failed (insufficient permissions) for user ${session.user.id} on API ${url} (Action: ${requiredPermission.action}, Subject: ${requiredPermission.subject})`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden'
      })
    }
    
    console.log(`Authorization successful (permissions check passed) for user ${session.user.id} on API ${url}`)
  } else {
    console.log(`No specific permission required for API: ${url}`)
  }

  // Add user information to event context for use in API handlers
  event.context.user = session.user
  event.context.session = session
})

// --- Usage in API Route Handlers ---
// After this middleware runs successfully, API handlers can access:
// - event.context.user: The authenticated user
// - event.context.session: The full session object

// Example API handler with instance-specific permission checking:
/*
// server/api/articles/[id].delete.ts
export default defineEventHandler(async (event) => {
  // User is already authenticated and authorized by middleware
  const user = event.context.user
  const articleId = getRouterParam(event, 'id')

  // Fetch the specific resource
  const article = await db.article.findUnique({ where: { id: articleId } })
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  // Instance-specific permission check
  const appUser = createAppUser(user)
  const hasPermission = can(appUser, Action.DELETE, Subject.ARTICLE, article)

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Proceed with the operation
  await db.article.delete({ where: { id: articleId } })
  return { success: true }
})
*/ 