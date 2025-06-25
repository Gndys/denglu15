<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t('common.welcome') }}</h1>
    
    <!-- 导航链接示例 - 使用 $localePath -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">{{ $t('navigation.dashboard') }}</h2>
      <nav class="space-x-4">
                 <NuxtLink :to="localePath('index')" class="text-blue-600 hover:underline">
           {{ $t('navigation.home') }}
         </NuxtLink>
         <NuxtLink :to="localePath('debug-i18n')" class="text-blue-600 hover:underline">
           Debug Page
         </NuxtLink>
        <a href="#" class="text-blue-600 hover:underline">{{ $t('navigation.orders') }}</a>
        <a href="#" class="text-blue-600 hover:underline">{{ $t('navigation.tracking') }}</a>
      </nav>
    </div>
    
    <!-- 操作按钮示例 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Actions</h2>
      <div class="space-x-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {{ $t('actions.save') }}
        </button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          {{ $t('actions.cancel') }}
        </button>
      </div>
    </div>
    
    <!-- 认证相关按钮 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Authentication</h2>
      <div class="space-x-4">
        <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {{ $t('common.login') }}
        </button>
        <button class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          {{ $t('common.signup') }}
        </button>
      </div>
    </div>
    
    <!-- 语言切换 - 使用 $switchLocalePath -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Language / 语言</h2>
      <div class="space-x-4">
                 <NuxtLink 
           :to="switchLocalePath('en')"
           :class="{ 'bg-blue-600': locale === 'en', 'bg-blue-500': locale !== 'en' }"
           class="inline-block text-white px-4 py-2 rounded hover:bg-blue-600"
         >
           English
         </NuxtLink>
         <NuxtLink 
           :to="switchLocalePath('zh-CN')"
           :class="{ 'bg-blue-600': locale === 'zh-CN', 'bg-blue-500': locale !== 'zh-CN' }"
           class="inline-block text-white px-4 py-2 rounded hover:bg-blue-600"
         >
           中文
         </NuxtLink>
      </div>
    </div>
    
    <!-- 调试信息 -->
    <div class="mt-8 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Debug Info:</h3>
      <p><strong>Current Locale:</strong> {{ locale }}</p>
      <p><strong>Default Locale:</strong> {{ defaultLocale }}</p>
      <p><strong>Available Locales:</strong> {{ availableLocales.join(', ') }}</p>
      <p><strong>Current Route:</strong> {{ $route.path }}</p>
      <p><strong>Is Default Locale:</strong> {{ locale === defaultLocale }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用 @nuxtjs/i18n 提供的标准 composables
const { t, locale, availableLocales, defaultLocale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

// 设置页面标题
useHead({
  title: computed(() => `${t('common.welcome')} - ShipEasy`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => t('navigation.home'))
    }
  ]
})
</script>
