<script setup lang="ts">
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-vue-next'

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Subscription data state
const subscriptionData = ref<any>(null)
const loading = ref(true)

/**
 * Fetch subscription data from API
 */
const fetchSubscriptionData = async () => {
  try {
    const data = await $fetch('/api/subscription/status')
    subscriptionData.value = data
  } catch (error) {
    console.error('Failed to fetch subscription data', error)
  } finally {
    loading.value = false
  }
}

/**
 * Navigate to subscription portal
 */
const navigateToPortal = async () => {
  try {
    loading.value = true
    const { url } = await $fetch('/api/subscription/portal', {
      method: 'POST',
      body: {}
    })
    
    if (url) {
      // Open in new tab for better UX
      window.open(url, '_blank')
    }
  } catch (error) {
    console.error('Failed to create portal session:', error)
    // You could add toast notification here
  } finally {
    loading.value = false
  }
}

/**
 * Format date according to user locale
 * @param dateString - Date string or Date object
 * @returns Formatted date string
 */
const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const currentLocale = locale.value
  return date.toLocaleDateString(currentLocale === 'zh-CN' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get subscription status display configuration
 * @returns Status display object with text, variant, and icon
 */
const subscriptionStatus = computed(() => {
  if (!subscriptionData.value) return null
  
  if (subscriptionData.value.isLifetime) {
    return {
      text: t('dashboard.subscription.status.lifetime'),
      variant: 'default' as const,
      icon: Crown
    }
  }
  
  if (subscriptionData.value.hasSubscription) {
    const status = subscriptionData.value.subscription?.status
    switch (status) {
      case 'active':
        return {
          text: t('dashboard.subscription.status.active'),
          variant: 'default' as const,
          icon: CheckCircle
        }
      case 'canceled':
        return {
          text: t('dashboard.subscription.status.canceled'),
          variant: 'secondary' as const,
          icon: XCircle
        }
      case 'past_due':
        return {
          text: t('dashboard.subscription.status.pastDue'),
          variant: 'destructive' as const,
          icon: Clock
        }
      default:
        return {
          text: status || t('dashboard.subscription.status.unknown'),
          variant: 'outline' as const,
          icon: CreditCard
        }
    }
  }
  
  return {
    text: t('dashboard.subscription.status.noSubscription'),
    variant: 'outline' as const,
    icon: CreditCard
  }
})

// Fetch data when component mounts
onMounted(() => {
  fetchSubscriptionData()
})
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <CreditCard class="h-5 w-5" />
      {{ t('dashboard.subscription.title') }}
    </h3>
    
    <!-- Loading state -->
    <div v-if="loading" class="animate-pulse">
      <div class="h-4 bg-muted rounded w-32 mb-2"></div>
      <div class="h-4 bg-muted rounded w-48"></div>
    </div>
    
    <!-- Subscription content -->
    <div v-else class="space-y-4">
      <div v-if="subscriptionStatus" class="flex items-center gap-2">
        <component :is="subscriptionStatus.icon" class="h-4 w-4" />
        <Badge :variant="subscriptionStatus.variant">
          {{ subscriptionStatus.text }}
        </Badge>
      </div>

      <!-- Lifetime membership -->
      <p v-if="subscriptionData?.isLifetime" class="text-muted-foreground">
        {{ t('dashboard.subscription.lifetimeAccess') }}
      </p>
      
      <!-- Active subscription -->
      <div v-else-if="subscriptionData?.hasSubscription">
        <div v-if="subscriptionData.subscription?.periodEnd" class="flex items-center gap-2 text-sm">
          <Calendar class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">
            {{ t('dashboard.subscription.expires') }}
          </span>
          <span>{{ formatDate(subscriptionData.subscription.periodEnd) }}</span>
        </div>
      </div>
      
      <!-- No subscription -->
      <p v-else class="text-muted-foreground">
        {{ t('dashboard.subscription.noActiveSubscription') }}
      </p>

      <!-- Action buttons -->
      <div>
        <Button 
          v-if="subscriptionData?.hasSubscription || subscriptionData?.isLifetime"
          variant="outline" 
          @click="navigateToPortal"
          :disabled="loading"
        >
          {{ t('dashboard.subscription.manageSubscription') }}
          <ExternalLink class="ml-2 h-4 w-4" />
        </Button>
        
        <Button v-else :as-child="true">
          <NuxtLink :to="localePath('/pricing')">
            {{ t('dashboard.subscription.viewPlans') }}
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template> 