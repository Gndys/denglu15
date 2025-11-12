<template>
  <div :class="cn('grid grid-cols-2 gap-3', className)">
    <SocialButton 
      v-for="provider in providers" 
      :key="provider" 
      :provider="provider"
      :loading="loadingProvider === provider"
      :disabled="loadingProvider !== null && loadingProvider !== provider"
      @click="handleProviderClick(provider)"
    />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { authClientVue } from '@libs/auth/authClient'
import type { SocialProvider } from '@/types/auth'
import { toast } from 'vue-sonner'

// Composables
const { t } = useI18n()

interface Props {
  className?: string
  providers?: SocialProvider[]
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  providers: () => ['google', 'github', 'wechat', 'phone']
})

// Navigation
const localePath = useLocalePath()

// Loading state
const loadingProvider = ref<SocialProvider | null>(null)

// Handle provider click
const handleProviderClick = async (provider: SocialProvider) => {
  // Prevent multiple simultaneous requests
  if (loadingProvider.value) return

  switch (provider) {
    case 'wechat':
      await navigateTo(localePath('/wechat'))
      break
    case 'phone':
      await navigateTo(localePath('/cellphone'))
      break
    default:
      // Set loading state for the clicked provider
      loadingProvider.value = provider
      
      try {
        // Other providers use default social login flow
        const { data, error } = await authClientVue.signIn.social({
          provider,
        })
        
        if (error) {
          console.error('Social login error:', error)
          toast.error(error.message || t('common.unexpectedError'))
        }
      } finally {
        loadingProvider.value = null
      }
  }
}
</script> 