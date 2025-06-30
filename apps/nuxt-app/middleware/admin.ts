/**
 * Admin middleware for Nuxt.js
 * Requires user to have admin permissions to access admin routes
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only apply to admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  // For client-side, do a basic check first
  if (import.meta.client) {
    const cookies = document.cookie
    const hasSession = cookies.includes('better-auth.session_token') || 
                      cookies.includes('better-auth-session')
    
    if (!hasSession) {
      // Not authenticated, redirect to signin
      const localePath = useLocalePath()
      return navigateTo(localePath('/signin'))
    }

    // TODO: Add more sophisticated role checking here
    // For now, we'll let the server-side API handle detailed permission checks
    // The actual permission verification will happen in the API routes themselves
  }

  // Note: More detailed permission checking should be done in:
  // 1. Server-side API routes (server/api/admin/*)
  // 2. Page components using composables or server utils
  // This middleware provides basic protection against unauthorized access
}) 