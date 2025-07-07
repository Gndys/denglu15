<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="sm" class="h-8 px-3">
        <PaletteIcon class="mr-2 h-4 w-4" />
        <span class="hidden sm:inline">
          {{ currentColorSchemeName }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem 
        v-for="[key, config] in Object.entries(THEME_CONFIG)" 
        :key="key"
        @click="setColorScheme(key as ColorScheme)"
      >
        <div 
          class="mr-2 h-4 w-4 rounded-full" 
          :style="{ backgroundColor: config.color }"
        />
        <span>{{ config.name }}</span>
        <CheckIcon 
          v-if="colorScheme === key" 
          class="ml-auto h-4 w-4" 
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { PaletteIcon, CheckIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import type { ColorScheme } from '../composables/useTheme'

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

const { colorScheme, setColorScheme } = useTheme()

// Computed property for current color scheme display name - no translation needed
const currentColorSchemeName = computed(() => {
  return THEME_CONFIG[colorScheme.value]?.name || 'Unknown'
})
</script> 