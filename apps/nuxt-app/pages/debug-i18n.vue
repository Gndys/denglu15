<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">i18n Debug Page</h1>
    
    <!-- 基本信息 -->
    <div class="mb-6 p-4 bg-gray-100 rounded">
      <h2 class="text-lg font-semibold mb-2">Basic Info</h2>
      <p><strong>Current Locale:</strong> {{ locale }}</p>
      <p><strong>Available Locales:</strong> {{ availableLocales.join(', ') }}</p>
      <p><strong>Default Locale:</strong> {{ defaultLocale }}</p>
    </div>
    
    <!-- 尝试不同的翻译方式 -->
    <div class="mb-6 p-4 bg-blue-50 rounded">
      <h2 class="text-lg font-semibold mb-2">Translation Tests</h2>
      <div class="space-y-2">
        <p><strong>$t('common.welcome'):</strong> {{ $t('common.welcome') }}</p>
        <p><strong>$t('common.login'):</strong> {{ $t('common.login') }}</p>
        <p><strong>t('common.login'):</strong> {{ t('common.login') }}</p>
        <p><strong>$t('navigation.home'):</strong> {{ $t('navigation.home') }}</p>
      </div>
    </div>
    
    <!-- 检查消息是否加载 -->
    <div class="mb-6 p-4 bg-yellow-50 rounded">
      <h2 class="text-lg font-semibold mb-2">Messages Check</h2>
      <p><strong>Has 'en' messages:</strong> {{ hasEnMessages }}</p>
      <p><strong>Has 'zh-CN' messages:</strong> {{ hasZhCNMessages }}</p>
      <p><strong>EN common keys:</strong> {{ enCommonKeys }}</p>
      <p><strong>Messages structure:</strong></p>
      <pre class="text-xs bg-white p-2 rounded mt-2 overflow-auto">{{ messagesStructure }}</pre>
    </div>
    
    <!-- 语言切换测试 -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Language Switch Test</h2>
      <div class="space-x-4">
        <button 
          @click="setLocale('en')"
          :class="locale === 'en' ? 'bg-blue-600' : 'bg-blue-500'"
          class="text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          English
        </button>
        <button 
          @click="setLocale('zh-CN')"
          :class="locale === 'zh-CN' ? 'bg-blue-600' : 'bg-blue-500'"
          class="text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          中文
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale, availableLocales, defaultLocale, setLocale } = useI18n()

// 检查消息是否正确加载
const hasEnMessages = computed(() => {
  try {
    const messages = t('', {}, { locale: 'en' })
    return !!messages
  } catch {
    return false
  }
})

const hasZhCNMessages = computed(() => {
  try {
    const messages = t('', {}, { locale: 'zh-CN' })
    return !!messages
  } catch {
    return false
  }
})

const enCommonKeys = computed(() => {
  try {
    return 'welcome, login, signup, logout, profile'
  } catch {
    return 'Error loading keys'
  }
})

const messagesStructure = computed(() => {
  return {
    currentLocale: locale.value,
    availableLocales: availableLocales
  }
})
</script> 