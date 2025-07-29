/**
 * Unified Authentication Middleware for Nuxt.js
 * Handles all authentication, authorization, and subscription checks in one place
 */
import { authClientVue } from '@libs/auth/authClient'
import { Action, Subject, can, createAppUser } from '@libs/permissions'
import { locales } from '@libs/i18n'


// Route configuration interface
interface ProtectedRouteConfig {
  pattern: RegExp
  type: 'page' | 'api'
  // Authentication requirements
  requiresAuth?: boolean
  // Permission required for access
  requiredPermission?: { 
    action: Action
    subject: Subject
  }
  // Subscription requirements
  requiresSubscription?: boolean
  // Auth route that should redirect logged-in users
  isAuthRoute?: boolean
  // Redirect subscribed users (e.g., pricing page)
  redirectIfSubscribed?: boolean
}

// Unified protected routes configuration - using Next.js style for consistency
const protectedRoutes: ProtectedRouteConfig[] = [
  // Auth routes - redirect logged-in users to dashboard
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/signin$`),
    type: 'page',
    isAuthRoute: true
  },
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/signup$`),
    type: 'page',
    isAuthRoute: true
  },
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/forgot-password$`),
    type: 'page',
    isAuthRoute: true
  },
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/reset-password$`),
    type: 'page',
    isAuthRoute: true
  },
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/cellphone$`),
    type: 'page',
    isAuthRoute: true
  },
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/wechat$`),
    type: 'page',
    isAuthRoute: true
  },
  
  // Admin routes - require admin permissions (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/admin(\\/.*)?$`),
    type: 'page',
    requiresAuth: true,
    requiredPermission: { action: Action.MANAGE, subject: Subject.ALL }
  },
  
  // Settings pages - require authentication only (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/settings(\\/.*)?$`),
    type: 'page'
  },
  
  // Dashboard - require authentication only (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/dashboard(\\/.*)?$`),
    type: 'page'
  },
  
  // Premium features - require active subscription (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/premium-features(\\/.*)?$`),
    type: 'page',
    requiresSubscription: true
  },
  
  // Pricing page - redirect subscribed users to dashboard (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/pricing$`),
    type: 'page',
    redirectIfSubscribed: true
  },
  
  // AI features - require authentication (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/ai(\\/.*)?$`),
    type: 'page'
  },
  
  // Payment pages - require authentication (require locale prefix)
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/payment-success$`),
    type: 'page'
  },
  {
    pattern: new RegExp(`^\\/(${locales.join('|')})\\/payment-cancel$`),
    type: 'page'
  }
]

/**
 * Check if user has valid subscription
 */
async function hasValidSubscription(userId: string): Promise<boolean> {
  try {
    const { checkSubscriptionStatus } = await import('@libs/database/utils/subscription')
    const subscription = await checkSubscriptionStatus(userId)
    return !!subscription
  } catch (error) {
    console.error('Failed to check subscription status:', error)
    return false
  }
}

/**
 * Get user session using Better Auth
 */
async function getUserSession() {
  try {
    // Since we already waited for auth to be ready in the middleware,
    // we can directly get the session
    const session = await authClientVue.getSession()
    
    return {
      session,
      user: session?.data?.user,
      isAuthenticated: !!session?.data?.user
    }
  } catch (error) {
    console.error('Failed to get session:', error)
    return {
      session: null,
      user: null,
      isAuthenticated: false
    }
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Add debug logging to see if middleware is triggered
  console.log(`🚀 Auth middleware triggered for: ${to.path}`)
  
  // Handle server-side checks for better UX
  if (import.meta.server) {
    console.log(`🖥️ Server-side auth check for: ${to.path}`)
    
    // Get headers for server-side session check
    const headers = useRequestHeaders(['cookie'])
    
    // Quick check for session cookie
    const hasCookie = headers.cookie?.includes('better-auth.session_token') || 
                     headers.cookie?.includes('better-auth-session')
    
    if (!hasCookie) {
      // Check if this route needs protection
      const matchedRoute = protectedRoutes.find(route => route.pattern.test(to.path))
      
      if (matchedRoute && !matchedRoute.isAuthRoute) {
        console.log(`🔒 No session cookie found for protected route: ${to.path}`)
        // Server-side redirect for better UX
        return navigateTo('/signin')
      }
    }
    
    return // Let client-side handle detailed checks
  }

  console.log(`🌐 Processing auth middleware on client for: ${to.path}`)

  console.log(`🔍 Checking path: ${to.path}`)

  // Check if current route matches any configured route
  const matchedRoute = protectedRoutes.find(route => route.pattern.test(to.path))
  
  if (!matchedRoute) {
    return // Route is not configured
  }

  console.log(`🔒 Configured route accessed: ${to.path} (Type: ${matchedRoute.type})`)

  // Handle auth routes: redirect logged-in users to dashboard
  if (matchedRoute.isAuthRoute) {
    console.log(`🔐 Auth route detected: ${to.path}`)
    
    // Get user session to check if already logged in
    const { user, isAuthenticated } = await getUserSession()
    
    if (isAuthenticated) {
      console.log(`↩️ User already authenticated, redirecting from ${to.path} to dashboard`)
      return navigateTo('/dashboard')
    }
    
    console.log(`✅ Guest user accessing auth route: ${to.path}`)
    return // Allow access to auth route
  }

  // On client-side, wait for auth to be ready before checking
  console.log(`⏳ Ensuring auth is ready on client-side for: ${to.path}`)

  // Get user session (client-side only now)
  console.log(`🔍 Getting user session for: ${to.path}`)
  const { user, isAuthenticated } = await getUserSession()
  console.log(`🔍 Session result: isAuthenticated=${isAuthenticated}, user=${user ? user.id : 'null'}`)

  // --- 1. Authentication Check ---
  if (!isAuthenticated) {
    console.log(`❌ Authentication failed for: ${to.path}`)
    
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

  // User is authenticated, continue with other checks

  // --- 2. Subscription Check (if required) ---
  if (matchedRoute.requiresSubscription) {
    console.log(`💳 Checking subscription for: ${to.path}, User: ${user!.id}`)
    
    const hasSubscription = await hasValidSubscription(user!.id)
    
    if (!hasSubscription) {
      console.log(`❌ Subscription check failed for: ${to.path}, User: ${user!.id}`)
      
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
    
    console.log(`✅ Subscription check passed for: ${to.path}`)
  }

  // --- 2.5. Redirect If Subscribed Check (e.g., pricing page) ---
  if (matchedRoute.redirectIfSubscribed) {
    console.log(`💰 Checking if subscribed user should be redirected from: ${to.path}, User: ${user!.id}`)
    
    const hasSubscription = await hasValidSubscription(user!.id)
    
    if (hasSubscription) {
      console.log(`↩️ User is subscribed, redirecting from ${to.path} to dashboard`)
      return navigateTo('/dashboard')
    }
    
    console.log(`✅ User is not subscribed, allowing access to: ${to.path}`)
  }

  // --- 3. Authorization Check (RBAC-Based) ---
  const requiredPermission = matchedRoute.requiredPermission
  
  if (requiredPermission) {
    console.log(`🛡️ Checking permissions for: ${to.path} (${requiredPermission.action}:${requiredPermission.subject})`)
    
    // Create AppUser from session data
    const appUser = createAppUser(user!)
    
    if (!appUser) {
      console.log(`❌ Authorization failed (user object missing) for: ${to.path}`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: User information missing'
      })
    }

    // Check permissions using RBAC system
    const hasPermission = can(appUser, requiredPermission.action, requiredPermission.subject)

    if (!hasPermission) {
      console.log(`❌ Authorization failed for user ${user!.id} (role: ${user!.role}) on ${to.path} (${requiredPermission.action}:${requiredPermission.subject})`)
      
      if (matchedRoute.type === 'page') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access Denied: Insufficient permissions'
        })
      } else {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden'
        })
      }
    }
    
    console.log(`✅ Authorization successful for user ${user!.id} on ${to.path}`)
  }

  console.log(`✅ Access granted to: ${to.path} for user: ${user!.id}`)
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