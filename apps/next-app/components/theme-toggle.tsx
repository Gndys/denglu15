'use client'

import * as React from 'react'
import { Moon, Sun, Palette, Check, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Theme configuration based on each theme's primary color
const THEME_CONFIG = {
  default: {
    name: 'Default',
    color: '#343434' // oklch(0.205 0 0) - Classic gray
  },
  claude: {
    name: 'Claude',
    color: '#b45309' // oklch(0.6171 0.1375 39.0427) - Warm orange
  },
  'cosmic-night': {
    name: 'Cosmic Night',
    color: '#7c3aed' // oklch(0.5417 0.1790 288.0332) - Deep purple
  },
  'modern-minimal': {
    name: 'Modern Minimal',
    color: '#6366f1' // oklch(0.6231 0.1880 259.8145) - Modern purple-blue
  },
  'ocean-breeze': {
    name: 'Ocean Breeze',
    color: '#10b981' // oklch(0.7227 0.1920 149.5793) - Ocean teal-green
  }
} as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="h-9 w-9"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          <Palette className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">
            {THEME_CONFIG[colorScheme]?.name || 'Unknown'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(THEME_CONFIG).map(([key, config]) => (
          <DropdownMenuItem 
            key={key}
            onClick={() => setColorScheme(key as keyof typeof THEME_CONFIG)}
          >
            <div 
              className="mr-2 h-4 w-4 rounded-full" 
              style={{ backgroundColor: config.color }}
            ></div>
            <span>{config.name}</span>
            {colorScheme === key && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Combined theme selector that includes both theme and color scheme
export function ThemeSelector() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          <Palette className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
          Appearance
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
          Color Scheme
        </div>
        
        {Object.entries(THEME_CONFIG).map(([key, config]) => (
          <DropdownMenuItem 
            key={key}
            onClick={() => setColorScheme(key as keyof typeof THEME_CONFIG)}
          >
            <div 
              className="mr-2 h-4 w-4 rounded-full" 
              style={{ backgroundColor: config.color }}
            ></div>
            <span>{config.name}</span>
            {colorScheme === key && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 