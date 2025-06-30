/**
 * Guest middleware for Nuxt.js
 * Redirects authenticated users away from auth pages (like signin, signup)
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only apply to authentication pages
  const authPages = [
    '/signin', '/signup', '/forgot-password', '/reset-password', 
    '/cellphone', '/wechat'
  ]
  
  if (!authPages.some(page => to.path === page || to.path.endsWith(page))) {
    return
  }

  // For client-side, check if user is already authenticated
  if (import.meta.client) {
    const cookies = document.cookie
    const hasSession = cookies.includes('better-auth.session_token') || 
                      cookies.includes('better-auth-session')
    
    if (hasSession) {
      // Redirect to dashboard if already authenticated
      const localePath = useLocalePath()
      return navigateTo(localePath('/dashboard'))
    }
  }
}) 