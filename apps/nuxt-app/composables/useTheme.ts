// Enhanced theme composable for Nuxt with localStorage persistence and color scheme support
export type Theme = 'light' | 'dark'
export type ColorScheme = 'default' | 'claude' | 'cosmic-night' | 'modern-minimal' | 'ocean-breeze'

interface ThemeState {
  theme: Theme
  colorScheme: ColorScheme
}

// Global state - 确保所有组件使用相同的状态实例
const STORAGE_KEY = 'tinyship-ui-theme'
const theme = ref<Theme>('light')
const colorScheme = ref<ColorScheme>('default')
const isInitialized = ref(false)

export const useTheme = () => {
  
  // Initialize state from localStorage or system preference
  const initializeTheme = () => {
    if (!process.client) return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { theme: storedTheme, colorScheme: storedColorScheme }: ThemeState = JSON.parse(stored)
        if (storedTheme) theme.value = storedTheme
        if (storedColorScheme) colorScheme.value = storedColorScheme
      } else {
        // Fallback to system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        theme.value = systemTheme
      }
    } catch (error) {
      // Fallback to system preference on error
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      theme.value = systemTheme
    }
  }
  
  // Apply theme classes to document
  const applyTheme = (saveToStorage = true) => {
    if (!process.client) return
    
    const root = document.documentElement
    
    // Remove existing light/dark classes
    root.classList.remove('light', 'dark')
    
    // Remove existing color scheme classes
    root.classList.remove(
      'theme-default', 
      'theme-claude', 
      'theme-cosmic-night', 
      'theme-modern-minimal', 
      'theme-ocean-breeze'
    )
    
    // Apply current theme (light is default, only add dark explicitly)
    if (theme.value === 'dark') {
      root.classList.add('dark')
    }
    
    // Apply color scheme (default doesn't need a class)
    if (colorScheme.value !== 'default') {
      root.classList.add(`theme-${colorScheme.value}`)
    }
    
    // Save to localStorage only if initialized and saveToStorage is true
    if (saveToStorage && isInitialized.value) {
      try {
        const dataToSave = {
          theme: theme.value,
          colorScheme: colorScheme.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      } catch (error) {
        console.warn('Failed to save theme preference to localStorage:', error)
      }
    }
  }
  
  // Theme setters
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }
  
  const setColorScheme = (newColorScheme: ColorScheme) => {
    colorScheme.value = newColorScheme
  }
  
  // Initialize only once
  if (process.client && !isInitialized.value) {
    onMounted(() => {
      initializeTheme()
      applyTheme(false) // 初始化时不保存
      isInitialized.value = true
      
      // Only set up watchers once
      nextTick(() => {
        // Watch for changes and apply them - 创建包装函数
        watch([theme, colorScheme], () => applyTheme(true), { immediate: false })
      })
      
      // Watch system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if no explicit theme is stored
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
          theme.value = e.matches ? 'dark' : 'light'
        }
      }
      
      mediaQuery.addEventListener('change', handleSystemThemeChange)
      
      // Cleanup on unmount
      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      })
    })
  }
  
  return {
    theme: readonly(theme),
    colorScheme: readonly(colorScheme),
    setTheme,
    setColorScheme
  }
} 