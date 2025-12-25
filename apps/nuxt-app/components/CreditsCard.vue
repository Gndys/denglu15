<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Coins class="h-5 w-5 text-primary" />
        {{ t('dashboard.credits.title') }}
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      
      <template v-else>
        <!-- Balance Display -->
        <div class="text-center p-6 bg-primary/10 rounded-xl">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Coins class="h-8 w-8 text-primary" />
            <span class="text-4xl font-bold text-foreground">
              {{ creditData?.credits.balance.toLocaleString() || 0 }}
            </span>
          </div>
          <p class="text-sm text-muted-foreground">
            {{ t('dashboard.credits.available') }}
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-green-500/10 rounded-lg">
            <div class="flex items-center gap-2 mb-1">
              <TrendingUp class="h-4 w-4 text-green-600 dark:text-green-500" />
              <span class="text-sm font-medium text-green-600 dark:text-green-500">
                {{ t('dashboard.credits.totalPurchased') }}
              </span>
            </div>
            <p class="text-xl font-bold text-foreground">
              {{ creditData?.credits.totalPurchased.toLocaleString() || 0 }}
            </p>
          </div>
          <div class="p-4 bg-orange-500/10 rounded-lg">
            <div class="flex items-center gap-2 mb-1">
              <TrendingDown class="h-4 w-4 text-orange-600 dark:text-orange-500" />
              <span class="text-sm font-medium text-orange-600 dark:text-orange-500">
                {{ t('dashboard.credits.totalConsumed') }}
              </span>
            </div>
            <p class="text-xl font-bold text-foreground">
              {{ creditData?.credits.totalConsumed.toLocaleString() || 0 }}
            </p>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div v-if="transactions.length > 0">
          <h4 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <History class="h-4 w-4" />
            {{ t('dashboard.credits.recentTransactions') }}
          </h4>
          <div class="space-y-2">
            <div 
              v-for="tx in transactions.slice(0, 3)" 
              :key="tx.id"
              class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <component 
                  :is="getTransactionTypeInfo(tx.type).icon" 
                  :class="['h-4 w-4', getTransactionTypeInfo(tx.type).color]"
                />
                <div>
                  <p class="text-sm font-medium text-foreground">
                    {{ tx.description || getTransactionTypeInfo(tx.type).label }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ formatDate(tx.createdAt) }}
                  </p>
                </div>
              </div>
              <span :class="['font-semibold', parseFloat(tx.amount) >= 0 ? 'text-green-600 dark:text-green-500' : 'text-orange-600 dark:text-orange-500']">
                {{ parseFloat(tx.amount) >= 0 ? '+' : '' }}{{ parseFloat(tx.amount).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Buy More Credits Button -->
        <NuxtLink :to="localePath('/pricing')">
          <Button class="w-full">
            <Coins class="h-4 w-4 mr-2" />
            {{ t('dashboard.credits.buyMore') }}
            <ArrowRight class="h-4 w-4 ml-2" />
          </Button>
        </NuxtLink>
      </template>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Coins, TrendingUp, TrendingDown, History, ArrowRight, Loader2 } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const { t, locale } = useI18n()
const localePath = useLocalePath()

interface CreditStatus {
  credits: {
    balance: number
    totalPurchased: number
    totalConsumed: number
  }
  hasSubscription: boolean
  canAccess: boolean
}

interface CreditTransaction {
  id: string
  type: string
  amount: string
  balance: string
  description: string | null
  createdAt: string
}

const loading = ref(true)
const creditData = ref<CreditStatus | null>(null)
const transactions = ref<CreditTransaction[]>([])

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get transaction type display info
const getTransactionTypeInfo = (type: string) => {
  const typeMap: Record<string, { label: string; color: string; icon: typeof TrendingUp }> = {
    purchase: { 
      label: t('dashboard.credits.types.purchase'), 
      color: 'text-green-600 dark:text-green-500',
      icon: TrendingUp
    },
    bonus: { 
      label: t('dashboard.credits.types.bonus'), 
      color: 'text-blue-600 dark:text-blue-500',
      icon: TrendingUp
    },
    consumption: { 
      label: t('dashboard.credits.types.consumption'), 
      color: 'text-orange-600 dark:text-orange-500',
      icon: TrendingDown
    },
    refund: { 
      label: t('dashboard.credits.types.refund'), 
      color: 'text-purple-600 dark:text-purple-500',
      icon: TrendingUp
    }
  }
  return typeMap[type] || { 
    label: type, 
    color: 'text-muted-foreground',
    icon: History
  }
}

// Fetch credit data
onMounted(async () => {
  try {
    const [statusResponse, transactionsResponse] = await Promise.all([
      $fetch('/api/credits/status'),
      $fetch('/api/credits/transactions', { query: { limit: 5 } })
    ])
    
    creditData.value = statusResponse as CreditStatus
    transactions.value = (transactionsResponse as { transactions: CreditTransaction[] })?.transactions || []
  } catch (error) {
    console.error('Failed to fetch credit data:', error)
  } finally {
    loading.value = false
  }
})
</script>

