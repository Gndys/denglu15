/**
 * Authentication middleware for Nuxt.js
 * Requires user to be logged in to access protected routes
 */
export default defineNuxtRouteMiddleware((to) => {
  // Skip authentication check for authentication pages and public pages
  const publicPages = [
    '/signin', '/signup', '/forgot-password', '/reset-password', 
    '/cellphone', '/wechat', '/', '/pricing'
  ]
  
  if (publicPages.some(page => to.path === page || to.path.endsWith(page))) {
    return
  }

  // For client-side, use a simple cookie check
  // Better-Auth stores session info in cookies
  if (import.meta.client) {
    const cookies = document.cookie
    const hasSession = cookies.includes('better-auth.session_token') || 
                      cookies.includes('better-auth-session')
    
    if (!hasSession) {
      const localePath = useLocalePath()
      const returnUrl = encodeURIComponent(to.fullPath)
      return navigateTo(`${localePath('/signin')}?returnUrl=${returnUrl}`)
    }
  }
}) 