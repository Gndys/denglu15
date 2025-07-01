<template>
  <Button 
    variant="ghost" 
    size="sm" 
    class="h-8 w-8 px-0" 
    @click="toggleTheme"
    :title="currentThemeLabel"
  >
    <!-- Light mode icon - show when current theme is light -->
    <SunIcon 
      v-if="$colorMode.preference === 'light'"
      class="h-4 w-4 transition-all"
    />
    <!-- Dark mode icon - show when current theme is dark -->
    <MoonIcon 
      v-else
      class="h-4 w-4 transition-all"
    />
    <span class="sr-only">{{ currentThemeLabel }}</span>
  </Button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const colorMode = useColorMode()
const { t } = useI18n()

// Simple toggle between light and dark
const toggleTheme = () => {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}

// Computed property for accessibility label
const currentThemeLabel = computed(() => {
  return colorMode.preference === 'light' 
    ? t('common.theme.dark') 
    : t('common.theme.light')
})
</script> 