// Theme initialization plugin for client-side hydration safety
export default defineNuxtPlugin(() => {
  // Prevent flash of unstyled content by ensuring theme is applied immediately
  if (process.client) {
    const STORAGE_KEY = 'tinyship-ui-theme'
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { theme, colorScheme } = JSON.parse(stored)
        const root = document.documentElement
        
        // Remove any existing theme classes first
        root.classList.remove('light', 'dark')
        root.classList.remove(
          'theme-default', 
          'theme-claude', 
          'theme-cosmic-night', 
          'theme-modern-minimal', 
          'theme-ocean-breeze'
        )
        
        // Apply stored theme immediately
        if (theme === 'dark') {
          root.classList.add('dark')
        }
        
        // Apply stored color scheme immediately
        if (colorScheme && colorScheme !== 'default') {
          root.classList.add(`theme-${colorScheme}`)
        }
      } else {
        // Apply system preference if no stored theme
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        if (systemTheme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      }
    } catch (error) {
      // Fallback to system preference on error
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (systemTheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }
}) 