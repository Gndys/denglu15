'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ColorScheme = 'default' | 'claude' | 'cosmic-night' | 'modern-minimal' | 'ocean-breeze'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  colorScheme: 'default',
  setTheme: () => null,
  setColorScheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultColorScheme = 'default',
  storageKey = 'tinyship-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme)

  useEffect(() => {
    const root = window.document.documentElement
    
    // Try to get stored preferences
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        const { theme: storedTheme, colorScheme: storedColorScheme } = JSON.parse(stored)
        if (storedTheme && storedTheme !== theme) {
          setTheme(storedTheme)
        }
        if (storedColorScheme && storedColorScheme !== colorScheme) {
          setColorScheme(storedColorScheme)
        }
      } catch (error) {
        console.warn('Failed to parse stored theme preferences:', error)
        // Fallback to system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        if (systemTheme !== theme) {
          setTheme(systemTheme)
        }
      }
    } else {
      // No stored preferences, use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (systemTheme !== theme) {
        setTheme(systemTheme)
      }
    }
  }, [storageKey]) // Remove theme and colorScheme from dependencies to prevent loops

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark', 'theme-default', 'theme-claude', 'theme-cosmic-night', 'theme-modern-minimal', 'theme-ocean-breeze')

    if (theme === 'dark') {
      root.classList.add('dark')
    }

    if (colorScheme === 'claude') {
      root.classList.add('theme-claude')
    } else if (colorScheme === 'cosmic-night') {
      root.classList.add('theme-cosmic-night')
    } else if (colorScheme === 'modern-minimal') {
      root.classList.add('theme-modern-minimal')
    } else if (colorScheme === 'ocean-breeze') {
      root.classList.add('theme-ocean-breeze')
    }

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify({ theme, colorScheme }))
  }, [theme, colorScheme, storageKey])

  const value = {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
} 