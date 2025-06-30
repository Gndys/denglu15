/**
 * Global authentication middleware for Nuxt.js
 * Handles route protection similar to Next.js authMiddleware
 */

import { Action, Subject, can, createAppUser, type AppUser } from '@libs/permissions'

// Define the structure for protected route configuration
interface ProtectedRouteConfig {
  pattern: RegExp
  type: 'page' | 'api'
  // Permission required for access
  requiredPermission?: { 
    action: Action
    subject: Subject
  }
  requiresSubscription?: boolean // Indicates if route requires active subscription
}

// Configuration for Protected Routes
// Based on the Next.js authMiddleware.ts implementation
const protectedRoutes: ProtectedRouteConfig[] = [
  // Admin routes - require admin permissions
  {
    pattern: /^\/admin(\/.*)?$/,
    type: 'page',
    requiredPermission: { action: Action.MANAGE, subject: Subject.ALL }
  },
  
  // Settings pages - require authentication only
  {
    pattern: /^\/settings(\/.*)?$/,
    type: 'page'
  },
  
  // Dashboard - require authentication only
  {
    pattern: /^\/dashboard(\/.*)?$/,
    type: 'page'
  },
  
  // Premium features - require active subscription
  {
    pattern: /^\/premium-features(\/.*)?$/,
    type: 'page',
    requiresSubscription: true
  },
  
  // AI features - require authentication (could add subscription later)
  {
    pattern: /^\/ai(\/.*)?$/,
    type: 'page'
  },

  // API routes protection
  {
    pattern: /^\/api\/admin\/(.*)?$/,
    type: 'api',
    requiredPermission: { action: Action.MANAGE, subject: Subject.ALL }
  },
  
  {
    pattern: /^\/api\/chat(\/.*)?$/,
    type: 'api'
    // Could add: requiredPermission: { action: Action.CREATE, subject: Subject.CHAT_MESSAGE }
  },
  
  {
    pattern: /^\/api\/premium(\/.*)?$/,
    type: 'api',
    requiresSubscription: true
  }
]

/**
 * Check if user has valid subscription
 * This would need to be implemented with actual subscription checking logic
 */
async function hasValidSubscription(userId: string): Promise<boolean> {
  // TODO: Implement actual subscription checking
  // For now, return true to allow access during development
  return true
  
  // Example implementation:
  // try {
  //   const { data: subscription } = await $fetch('/api/subscription/status', {
  //     method: 'POST',
  //     body: { userId }
  //   })
  //   return subscription?.status === 'active'
  // } catch {
  //   return false
  // }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for auth pages and public routes
  const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/cellphone', '/wechat']
  const publicRoutes = ['/', '/pricing']
  
  if (authRoutes.includes(to.path) || publicRoutes.includes(to.path)) {
    return
  }

  // Skip API routes in client-side navigation
  if (process.client && to.path.startsWith('/api/')) {
    return
  }

  // Check if current route matches any protected route
  const matchedRoute = protectedRoutes.find(route => route.pattern.test(to.path))
  
  if (!matchedRoute) {
    return // Route is not protected
  }

  console.log(`Protected route accessed: ${to.path}, Type: ${matchedRoute.type}`)

  // Get user session
  const { user, isAuthenticated } = useAuth()
  
  // --- 1. Authentication Check ---
  if (!isAuthenticated.value || !user.value) {
    console.log(`Authentication failed for: ${to.path}`)
    
    if (matchedRoute.type === 'page') {
      // Redirect to signin page
      return navigateTo('/signin')
    } else {
      // For API routes, this would be handled by server middleware
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
  }

  // --- 2. Subscription Check (if required) ---
  if (matchedRoute.requiresSubscription) {
    console.log(`Subscription check for: ${to.path}, User: ${user.value.id}`)
    
    const hasSubscription = await hasValidSubscription(user.value.id)
    console.log('hasSubscription', hasSubscription)
    
    if (!hasSubscription) {
      console.log(`Subscription check failed for: ${to.path}, User: ${user.value.id}`)
      
      if (matchedRoute.type === 'page') {
        // Redirect to pricing page
        return navigateTo('/pricing')
      } else {
        throw createError({
          statusCode: 402,
          statusMessage: 'Subscription required'
        })
      }
    }
  }

  // --- 3. Authorization Check (RBAC-Based) ---
  console.log(`Authentication successful for: ${to.path}, User: ${user.value.id}`)
  
  const requiredPermission = matchedRoute.requiredPermission
  
  if (requiredPermission) {
    // Create AppUser from session data
    const appUser = createAppUser(user.value)
    
    if (!appUser) {
      console.log(`Authorization failed (user object missing) for: ${to.path}`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: User information missing'
      })
    }

    // Check permissions using RBAC system
    const hasPermission = can(appUser, requiredPermission.action, requiredPermission.subject)

    if (!hasPermission) {
      console.log(`Authorization failed (insufficient permissions) for user ${user.value.id} on ${to.path} (Action: ${requiredPermission.action}, Subject: ${requiredPermission.subject})`)
      
      if (matchedRoute.type === 'page') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access Denied'
        })
      } else {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden'
        })
      }
    }
    
    console.log(`Authorization successful (permissions check passed) for user ${user.value.id} on ${to.path}`)
  } else {
    console.log(`No specific permission required for: ${to.path}`)
  }
})

// --- Two-Layer Authorization Concept ---
// This middleware handles the FIRST layer of authorization:
// 1. Authentication: Is the user logged in?
// 2. General Permissions: Does the user's role/abilities generally allow
//    them to perform the requested action on the requested resource type?
//    Example check: can(user, Action.DELETE, Subject.ARTICLE)

// The SECOND layer of authorization (instance-specific checks) 
// MUST happen later, within the specific API route handler or page component.
// This is because middleware doesn't have access to the specific resource instance.

// Example for API Route Handler (e.g., server/api/articles/[id].delete.ts):
/*
export default defineEventHandler(async (event) => {
  // 1. Get session (already passed middleware auth check)
  const session = await getServerSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // 2. Get the specific resource ID
  const articleId = getRouterParam(event, 'id')

  // 3. Fetch the resource instance from the database
  const article = await db.article.findUnique({ where: { id: articleId } })
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  // 4. Perform the INSTANCE-SPECIFIC permission check
  const appUser = createAppUser(session.user)
  const hasPermission = can(appUser, Action.DELETE, Subject.ARTICLE, article)

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // 5. Proceed with the operation
  await db.article.delete({ where: { id: articleId } })
  return { success: true }
})
*/ 