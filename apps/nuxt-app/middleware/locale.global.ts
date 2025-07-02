/**
 * Global locale middleware for Nuxt.js
 * Handles automatic locale redirection for URLs without locale prefix
 * Similar to Next.js localeMiddleware implementation
 */

const supportedLocales = ['en', 'zh-CN']
const defaultLocale = 'zh-CN'

/**
 * Check if pathname is missing locale prefix
 */
function isPathnameMissingLocale(pathname: string): boolean {
  return supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
}

/**
 * Simple locale detection from browser headers
 */
function detectLocaleFromBrowser(): string {
  if (process.server) {
    try {
      // Get from Accept-Language header using useRequestHeaders
      const headers = useRequestHeaders(['accept-language'])
      const acceptLanguage = headers['accept-language']
      if (acceptLanguage) {
        // Simple language detection - prioritize Chinese
        if (acceptLanguage.includes('zh')) {
          return 'zh-CN'
        }
        if (acceptLanguage.includes('en')) {
          return 'en'
        }
      }
    } catch (error) {
      // If we can't access request context, fallback to default
      console.warn('Could not detect locale from headers:', error)
    }
  }
  
  return defaultLocale
}

export default defineNuxtRouteMiddleware((to) => {
  // Skip for server-side API routes
  if (to.path.startsWith('/api/')) {
    return
  }
  
  // Skip for client-side navigation after initial load
  if (process.client && to.name && to.name.toString().includes('___')) {
    return
  }
  
  const pathname = to.path
  const search = to.fullPath.includes('?') ? to.fullPath.substring(to.fullPath.indexOf('?')) : ''
  
  // Check if locale is missing from pathname
  if (isPathnameMissingLocale(pathname)) {
    // Use simple browser detection instead of cookie reading
    const detectedLocale = detectLocaleFromBrowser()
    
    // Construct new URL with locale prefix
    const newPath = `/${detectedLocale}${pathname === '/' ? '' : pathname}${search}`
    
    console.log(`Locale redirect: ${to.fullPath} -> ${newPath}`)
    
    // Redirect to URL with locale prefix
    return navigateTo(newPath, { redirectCode: 301 })
  }
}) 