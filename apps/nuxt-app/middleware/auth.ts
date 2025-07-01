import { authClientVue } from "@libs/auth/authClient"

/**
 * Authentication middleware for Nuxt.js
 * Requires user to be logged in to access protected routes
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip authentication check for authentication pages and public pages
  const publicPages = [
    '/signin', '/signup', '/forgot-password', '/reset-password', 
    '/cellphone', '/wechat', '/', '/pricing', '/ai', '/premium-features'
  ]
  
  // Extract the path without locale prefix for checking
  const pathWithoutLocale = to.path.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/'
  
  if (publicPages.includes(pathWithoutLocale)) {
    return
  }

  // For client-side, use Better Auth session check
  if (import.meta.client) {
    try {
      // Use Better Auth to get session
      const session = await authClientVue.getSession()
      
      if (!session?.data?.user) {
        console.log('No valid session found, redirecting to signin')
        const returnUrl = encodeURIComponent(to.fullPath)
        return navigateTo(`/signin?returnUrl=${returnUrl}`)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      const returnUrl = encodeURIComponent(to.fullPath)
      return navigateTo(`/signin?returnUrl=${returnUrl}`)
    }
  }
}) 