/**
 * Subscription middleware for Nuxt.js
 * Requires user to have valid subscription to access premium features
 */
export default defineNuxtRouteMiddleware((to) => {
  // Define routes that require subscription
  const subscriptionRequiredRoutes = [
    '/premium-features',
    '/ai' // AI chat requires subscription
  ]
  
  // Check if current route requires subscription
  const requiresSubscription = subscriptionRequiredRoutes.some(route => 
    to.path === route || to.path.startsWith(route + '/')
  )
  
  if (!requiresSubscription) {
    return
  }

  // For client-side, do a basic authentication check first
  if (import.meta.client) {
    const cookies = document.cookie
    const hasSession = cookies.includes('better-auth.session_token') || 
                      cookies.includes('better-auth-session')
    
    if (!hasSession) {
      // Not authenticated, redirect to signin
      const localePath = useLocalePath()
      return navigateTo(localePath('/signin'))
    }

    // TODO: Add subscription status checking here
    // For now, we'll let the server-side API handle detailed subscription checks
    // The actual subscription verification will happen in the API routes themselves
  }

  // Note: More detailed subscription checking should be done in:
  // 1. Server-side API routes that require subscription
  // 2. Page components using composables that check subscription status
  // 3. Using the hasValidSubscription utility from libs/database/utils/subscription
  // This middleware provides basic protection and can redirect to pricing page
}) 