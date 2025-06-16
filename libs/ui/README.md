# TinyShip UI Library

A pure CSS-based design system for modern web applications, built with Tailwind CSS and CSS variables.

## Features

- 🎨 **Multi-Theme System**: Default, Claude, and Cosmic Night color schemes
- 🌗 **Dark Mode Support**: Automatic dark mode adaptation for all themes
- 🎯 **CSS Variables**: Modern CSS custom properties
- 🌈 **Chart Color System**: 5-color chart palette with transparency variants
- 🎨 **Gradient System**: Warm and cool gradient combinations
- 🚀 **Zero Dependencies**: Pure CSS solution
- 📦 **Lightweight**: Minimal bundle size

## Philosophy

This UI library follows the principle of separation of concerns:
- **UI Library**: Pure CSS themes and styles
- **Application**: React components and hooks

## Theme System

The UI library includes a sophisticated multi-theme system:

### Color Schemes

1. **Default Theme**: Classic gray-scale with blue-purple gradients
2. **Claude Theme**: Warm, sophisticated theme inspired by Claude AI
3. **Cosmic Night Theme**: Mystical purple-based theme with cosmic vibes

### CSS Variables

#### Default Theme
- Primary: `oklch(0.205 0 0)` (Classic gray)
- Chart Colors: Blue, teal, purple, yellow, orange spectrum
- Gradients: `gradient-chart-warm` (orange → yellow), `gradient-chart-cool` (blue → purple)

#### Claude Theme  
- Primary: `oklch(0.6171 0.1375 39.0427)` (Warm orange)
- Chart Colors: Orange, purple, light gray, light purple, orange variants
- Gradients: `gradient-chart-warm` (orange → orange), `gradient-chart-cool` (purple → orange)

#### Cosmic Night Theme
- Primary: `oklch(0.5417 0.1790 288.0332)` (Deep purple)
- Chart Colors: Purple, lavender, magenta, blue-purple, dark purple spectrum
- Gradients: `gradient-chart-warm` (purple → magenta), `gradient-chart-cool` (lavender → blue-purple)

## Usage

### 1. Import Styles

In your application's CSS file (e.g., `globals.css`):

```css
/* Import shared UI styles */
@import "../../../libs/ui/styles/index.css";
```

### 2. Theme Switching

The theme system uses CSS classes on the document root:
- `.dark` for dark mode
- `.theme-claude` for Claude color scheme
- `.theme-cosmic-night` for Cosmic Night color scheme

Example theme switching logic:
```javascript
// Switch to dark mode
document.documentElement.classList.add('dark')

// Switch to Claude theme
document.documentElement.classList.add('theme-claude')

// Switch to Cosmic Night theme
document.documentElement.classList.add('theme-cosmic-night')

// Cosmic Night dark mode
document.documentElement.classList.add('theme-cosmic-night', 'dark')
```

## Utility Classes

### Chart Colors
```css
.bg-chart-1, .bg-chart-2, .bg-chart-3, .bg-chart-4, .bg-chart-5  /* Chart backgrounds */
.text-chart-1, .text-chart-2, .text-chart-3, .text-chart-4, .text-chart-5  /* Chart text colors */
.bg-chart-1-10, .bg-chart-1-15, .bg-chart-2-15, etc.  /* Chart colors with transparency */
```

### Gradient Backgrounds
```css
.bg-gradient-chart-warm        /* Warm gradient (theme-aware) */
.bg-gradient-chart-cool        /* Cool gradient (theme-aware) */
```

### Gradient Text
```css
.text-gradient-chart-warm      /* Warm gradient text effect */
.text-gradient-chart-cool      /* Cool gradient text effect */
```

### Animations
```css
.animate-blob                  /* Floating blob animation */
.animation-delay-2000          /* 2s animation delay */
.animation-delay-4000          /* 4s animation delay */
```

## File Structure

```
libs/ui/
├── styles/
│   ├── themes/
│   │   ├── default.css      # Default theme variables
│   │   ├── claude.css       # Claude theme variables
│   │   └── cosmic-night.css # Cosmic Night theme variables
│   └── index.css           # Main styles and utilities
├── utils/
│   └── cn.ts               # className utility function
└── README.md
```

## Examples

### Basic Usage with Tailwind

```html
<!-- Default button using theme primary color -->
<button class="bg-primary text-primary-foreground px-4 py-2 rounded">
  Click me
</button>

<!-- Chart color backgrounds -->
<div class="bg-chart-1 text-white p-4 rounded">Chart Color 1</div>
<div class="bg-chart-2 text-white p-4 rounded">Chart Color 2</div>

<!-- Gradient backgrounds -->
<div class="bg-gradient-chart-warm p-8 rounded-lg">
  <h2 class="text-white">Warm gradient background</h2>
</div>

<div class="bg-gradient-chart-cool p-8 rounded-lg">
  <h2 class="text-white">Cool gradient background</h2>
</div>

<!-- Gradient text -->
<h1 class="text-gradient-chart-warm text-4xl font-bold">
  Warm Gradient Text
</h1>

<h1 class="text-gradient-chart-cool text-4xl font-bold">
  Cool Gradient Text
</h1>
```

### CSS Custom Properties

All theme colors are available as CSS custom properties:

```css
.my-component {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}

.my-chart-element {
  background-color: var(--chart-1-bg);
  color: var(--chart-1-text);
}

.my-gradient {
  background: var(--gradient-chart-warm);
}

.my-cool-gradient {
  background: var(--gradient-chart-cool);
}
```

## Theme Implementation

### CSS Layer Structure
```css
@import './themes/default.css';      /* Base theme (:root) */
@import './themes/claude.css';       /* Override theme (.theme-claude) */
@import './themes/cosmic-night.css'; /* Override theme (.theme-cosmic-night) */
```

### Adding New Themes

1. Create a new theme file in `libs/ui/styles/themes/`
2. Use CSS class selector (e.g., `.theme-myname`)
3. Define all required CSS variables
4. Add import to `index.css`

Example:
```css
/* libs/ui/styles/themes/mytheme.css */
.theme-mytheme {
  --primary: oklch(0.6 0.2 120);
  --primary-foreground: oklch(1 0 0);
  --chart-1: oklch(0.6 0.2 120);
  --chart-2: oklch(0.7 0.15 140);
  /* ... other chart colors */
  
  /* Chart color utilities */
  --chart-1-bg: oklch(0.6 0.2 120);
  --chart-1-text: oklch(0.6 0.2 120);
  --chart-1-bg-15: oklch(0.6 0.2 120 / 0.15);
  /* ... other chart utilities */
  
  /* Gradients */
  --gradient-chart-warm: linear-gradient(to right, oklch(0.6 0.2 120), oklch(0.7 0.15 140));
  --gradient-chart-cool: linear-gradient(to right, oklch(0.5 0.25 200), oklch(0.6 0.2 220));
  /* ... other variables */
}

.theme-mytheme.dark {
  /* Dark mode overrides */
  --primary: oklch(0.7 0.15 120);
  --chart-1: oklch(0.7 0.15 120);
  /* ... update chart colors and gradients for dark mode */
}
```

## Integration with Applications

For React applications, you'll typically want to create:

1. **Theme Provider**: Context for theme state management
2. **Theme Hook**: Custom hook for accessing theme state
3. **Theme Toggle Components**: UI components for switching themes

These should be implemented at the application level, not in this UI library.

### Next.js Implementation Example

Here's how to implement the theme system in a Next.js application:

#### 1. Theme Hook (`hooks/use-theme.tsx`)

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ColorScheme = 'default' | 'claude' | 'cosmic-night'

type ThemeProviderState = {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'light',
  colorScheme: 'default',
  setTheme: () => null,
  setColorScheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultColorScheme = 'default',
  storageKey = 'tinyship-ui-theme',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme)

  useEffect(() => {
    const root = window.document.documentElement
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        const { theme: storedTheme, colorScheme: storedColorScheme } = JSON.parse(stored)
        if (storedTheme) setTheme(storedTheme)
        if (storedColorScheme) setColorScheme(storedColorScheme)
      } catch (error) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setTheme(systemTheme)
      }
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark', 'theme-default', 'theme-claude', 'theme-cosmic-night')

    if (theme === 'dark') {
      root.classList.add('dark')
    }

    if (colorScheme === 'claude') {
      root.classList.add('theme-claude')
    } else if (colorScheme === 'cosmic-night') {
      root.classList.add('theme-cosmic-night')
    }

    localStorage.setItem(storageKey, JSON.stringify({ theme, colorScheme }))
  }, [theme, colorScheme, storageKey])

  return (
    <ThemeProviderContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

#### 2. Theme Toggle Components (`components/theme-toggle.tsx`)

```typescript
'use client'

import { Moon, Sun, Palette, Check } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  }
} as const

// Simple theme toggle (light/dark)
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

// Color scheme selector
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

// Combined theme selector
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
        
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
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
```

#### 3. Usage in App

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/hooks/use-theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light" defaultColorScheme="default">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// components/header.tsx
import { ThemeToggle, ColorSchemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <ThemeToggle />
        <ColorSchemeToggle />
      </nav>
    </header>
  )
}
```

### Key Features

- **Persistent Storage**: Theme preferences saved to localStorage
- **System Preference Detection**: Automatically detects user's system theme
- **Type Safety**: Full TypeScript support with proper typing
- **Scalable Configuration**: Easy to add new themes via `THEME_CONFIG`
- **Visual Indicators**: Each theme has a unique color indicator
- **Hydration Safe**: Prevents hydration mismatches in SSR

## Contributing

1. Keep this library pure CSS - no React components
2. Follow existing naming conventions
3. Test theme switching in both light and dark modes
4. Ensure accessibility compliance
5. Update documentation for new themes or utilities

## Design Principles

- **Separation of Concerns**: Styles separate from logic
- **CSS-First**: Leverage native CSS features
- **Performance**: Minimal runtime overhead
- **Flexibility**: Easy to customize and extend
- **Compatibility**: Works with any framework or vanilla JS 