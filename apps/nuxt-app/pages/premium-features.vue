<template>
  <div>
    <!-- SEO Head -->
    <Head>
      <title>高级功能 - {{ $t('common.siteName') }}</title>
      <meta name="description" content="查看您可以使用的所有高级功能和订阅详情" />
      <meta name="keywords" content="高级功能, 订阅, 会员, 专业版" />
    </Head>

    <div class="container py-10">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <span class="ml-2 text-muted-foreground">{{ $t('common.loading') }}</span>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div class="flex-1 space-y-4">
            <div class="inline-flex items-center gap-2">
              <h1 class="text-3xl font-bold tracking-tight">高级功能</h1>
              <Badge v-if="userData?.isLifetime" variant="outline" class="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                终身会员
              </Badge>
            </div>
            <p class="text-muted-foreground">
              感谢您的订阅！以下是您现在可以使用的所有高级功能。
            </p>
          </div>
        </div>

        <!-- Subscription Info -->
        <Card v-if="userData" class="mt-6 mb-8">
          <CardHeader>
            <CardTitle>您的订阅</CardTitle>
            <CardDescription>当前订阅状态和详细信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <p class="text-sm font-medium">订阅状态</p>
                <div class="flex items-center space-x-2">
                  <div v-if="userData.subscriptionActive" class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div v-else class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span :class="userData.subscriptionActive ? 'text-green-600' : 'text-red-600'">
                    {{ userData.subscriptionActive ? '已激活' : '未激活' }}
                  </span>
                </div>
              </div>
              
              <div class="space-y-2">
                <p class="text-sm font-medium">订阅类型</p>
                <p class="text-sm text-muted-foreground">
                  {{ userData.isLifetime ? '终身会员' : '周期性订阅' }}
                </p>
              </div>
              
              <div v-if="!userData.isLifetime && userData.expiresAt" class="space-y-2">
                <p class="text-sm font-medium">到期时间</p>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(userData.expiresAt) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Premium Features Grid -->
        <div class="grid gap-6 pt-4 md:grid-cols-2 lg:grid-cols-4">
          <Card v-for="(feature, index) in premiumFeatures" :key="index" class="flex flex-col justify-between">
            <CardHeader>
              <div class="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-4">
                <component :is="feature.icon" />
              </div>
              <CardTitle>{{ feature.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">{{ feature.description }}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="w-full">访问功能</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader2, User, Sparkles, FileText, BarChart } from 'lucide-vue-next'

// Router and i18n
const { t } = useI18n()

// Reactive state
const isLoading = ref(true)
const userData = ref<{
  subscriptionActive: boolean
  subscriptionType: string
  isLifetime: boolean
  expiresAt?: string
} | null>(null)

// Premium features data
const premiumFeatures = [
  {
    icon: User,
    title: "高级用户管理",
    description: "完整的用户档案管理和自定义设置"
  },
  {
    icon: Sparkles,
    title: "AI 智能助手",
    description: "先进的人工智能功能，提升工作效率"
  },
  {
    icon: FileText,
    title: "无限文档处理",
    description: "处理任意数量和大小的文档文件"
  },
  {
    icon: BarChart,
    title: "详细数据分析",
    description: "深入的数据分析和可视化报表"
  }
]

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// Fetch subscription details
const fetchSubscriptionDetails = async () => {
  try {
    const response = await $fetch('/api/subscription/status')
    
    if (response) {
      userData.value = {
        subscriptionActive: response.hasSubscription,
        subscriptionType: response.isLifetime ? 'lifetime' : 'recurring',
        isLifetime: response.isLifetime,
        expiresAt: response.subscription?.periodEnd
      }
    }
  } catch (error) {
    console.error('Failed to fetch subscription details', error)
  } finally {
    isLoading.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  fetchSubscriptionDetails()
})

// SEO
useHead({
  title: '高级功能',
  meta: [
    { name: 'description', content: '查看您可以使用的所有高级功能和订阅详情' },
    { name: 'keywords', content: '高级功能, 订阅, 会员, 专业版' }
  ]
})
</script> 