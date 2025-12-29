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
        <!-- Stats - 3 columns in a row -->
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 bg-muted/50 rounded-lg text-center">
            <div class="flex items-center justify-center gap-2 mb-1">
              <Coins class="h-4 w-4 text-primary" />
              <span class="text-sm font-medium text-muted-foreground">
                {{ t('dashboard.credits.available') }}
              </span>
            </div>
            <p class="text-2xl font-bold text-foreground">
              {{ creditData?.credits.balance.toLocaleString() || 0 }}
            </p>
          </div>
          <div class="p-4 bg-muted/50 rounded-lg text-center">
            <div class="flex items-center justify-center gap-2 mb-1">
              <TrendingUp class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium text-muted-foreground">
                {{ t('dashboard.credits.totalPurchased') }}
              </span>
            </div>
            <p class="text-2xl font-bold text-foreground">
              {{ creditData?.credits.totalPurchased.toLocaleString() || 0 }}
            </p>
          </div>
          <div class="p-4 bg-muted/50 rounded-lg text-center">
            <div class="flex items-center justify-center gap-2 mb-1">
              <TrendingDown class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium text-muted-foreground">
                {{ t('dashboard.credits.totalConsumed') }}
              </span>
            </div>
            <p class="text-2xl font-bold text-foreground">
              {{ creditData?.credits.totalConsumed.toLocaleString() || 0 }}
            </p>
          </div>
        </div>

        <!-- Transactions Table -->
        <div v-if="transactions.length > 0">
          <h4 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <History class="h-4 w-4" />
            {{ t('dashboard.credits.recentTransactions') }}
          </h4>
          <div class="rounded-md border">
            <table class="w-full">
              <thead class="bg-muted">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    {{ t('dashboard.credits.table.type') }}
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    {{ t('dashboard.credits.table.description') }}
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">
                    {{ t('dashboard.credits.table.amount') }}
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">
                    {{ t('dashboard.credits.table.time') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr 
                  v-for="tx in paginatedTransactions" 
                  :key="tx.id"
                  class="hover:bg-muted/50"
                >
                  <td class="px-3 py-3">
                    <Badge :variant="getTransactionTypeInfo(tx.type).variant" class="text-xs">
                      <component 
                        :is="getTransactionTypeInfo(tx.type).icon" 
                        class="h-3 w-3 mr-1"
                      />
                      {{ getTransactionTypeInfo(tx.type).label }}
                    </Badge>
                  </td>
                  <td class="px-3 py-3 text-sm text-foreground">
                    {{ getDescriptionDisplay(tx.description) }}
                  </td>
                  <td :class="['px-3 py-3 text-sm font-medium text-right', parseFloat(tx.amount) >= 0 ? 'text-foreground' : 'text-muted-foreground']">
                    {{ parseFloat(tx.amount) >= 0 ? '+' : '' }}{{ parseFloat(tx.amount).toLocaleString() }}
                  </td>
                  <td class="px-3 py-3 text-sm text-muted-foreground text-right">
                    {{ formatDate(tx.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-4 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              :disabled="currentPage <= 1"
              @click="handlePageChange(currentPage - 1)"
            >
              {{ locale === 'zh-CN' ? '上一页' : 'Previous' }}
            </Button>
            <span class="flex items-center px-3 text-sm text-muted-foreground">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              :disabled="currentPage >= totalPages"
              @click="handlePageChange(currentPage + 1)"
            >
              {{ locale === 'zh-CN' ? '下一页' : 'Next' }}
            </Button>
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
import { ref, computed, onMounted } from 'vue'
import { Coins, TrendingUp, TrendingDown, History, ArrowRight, Loader2, Gift, RotateCcw } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

const PAGE_SIZE = 5

const loading = ref(true)
const creditData = ref<CreditStatus | null>(null)
const transactions = ref<CreditTransaction[]>([])
const currentPage = ref(1)

// Mock data for preview - using type codes for descriptions
const MOCK_TRANSACTIONS: CreditTransaction[] = [
  { id: '1', type: 'purchase', amount: '500', balance: '500', description: 'purchase', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', type: 'consumption', amount: '-25', balance: '475', description: 'ai_chat', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '3', type: 'consumption', amount: '-15', balance: '460', description: 'ai_chat', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: '4', type: 'bonus', amount: '100', balance: '560', description: 'bonus', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '5', type: 'consumption', amount: '-30', balance: '530', description: 'ai_chat', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: '6', type: 'purchase', amount: '200', balance: '730', description: 'purchase', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '7', type: 'consumption', amount: '-45', balance: '685', description: 'ai_chat', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
  { id: '8', type: 'refund', amount: '50', balance: '735', description: 'refund', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]

const MOCK_CREDIT_STATUS: CreditStatus = {
  credits: {
    balance: 735,
    totalPurchased: 700,
    totalConsumed: 115,
  },
  hasSubscription: false,
  canAccess: true,
}

// Pagination
const totalPages = computed(() => Math.ceil(transactions.value.length / PAGE_SIZE))
const paginatedTransactions = computed(() => 
  transactions.value.slice(
    (currentPage.value - 1) * PAGE_SIZE,
    currentPage.value * PAGE_SIZE
  )
)

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

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
  const typeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof TrendingUp }> = {
    purchase: { 
      label: t('dashboard.credits.types.purchase'), 
      variant: 'default',
      icon: TrendingUp
    },
    bonus: { 
      label: t('dashboard.credits.types.bonus'), 
      variant: 'secondary',
      icon: Gift
    },
    consumption: { 
      label: t('dashboard.credits.types.consumption'), 
      variant: 'outline',
      icon: TrendingDown
    },
    refund: { 
      label: t('dashboard.credits.types.refund'), 
      variant: 'secondary',
      icon: RotateCcw
    },
    adjustment: { 
      label: t('dashboard.credits.types.adjustment'), 
      variant: 'secondary',
      icon: History
    }
  }
  return typeMap[type] || { 
    label: type, 
    variant: 'outline' as const,
    icon: History
  }
}

// Get translated description for type codes
const getDescriptionDisplay = (description: string | null) => {
  if (!description) return '-'
  
  // Check if it's a known type code and translate it
  const descriptionKey = `dashboard.credits.descriptions.${description}`
  const translated = t(descriptionKey)
  
  // If translation exists (not same as key), use it; otherwise return original
  if (translated !== descriptionKey) {
    return translated
  }
  
  // Return as-is if not a known code (legacy data)
  return description
}

// Fetch credit data
onMounted(async () => {
  try {
    // Use mock data for preview
    const useMockData = true
    
    if (useMockData) {
      creditData.value = MOCK_CREDIT_STATUS
      transactions.value = MOCK_TRANSACTIONS
      loading.value = false
      return
    }

    const [statusResponse, transactionsResponse] = await Promise.all([
      $fetch('/api/credits/status'),
      $fetch('/api/credits/transactions', { query: { limit: 50 } })
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
