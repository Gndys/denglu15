<template>
  <Card class="w-[380px]">
    <CardHeader class="text-center">
      <CardTitle class="text-xl">{{ t('auth.signin.welcomeBack') }}</CardTitle>
      <CardDescription>
        {{ t('auth.signin.socialLogin') }}
      </CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-6">
      <SocialAuth />
      <div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span class="bg-card relative z-10 px-2 text-muted-foreground">
          {{ t('auth.signin.continueWith') }}
        </span>
      </div>
      <div class="flex flex-col gap-4">
        <LoginForm />
      </div>
      <div class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {{ t('auth.signin.termsNotice') }} <a href="#">{{ t('auth.signin.termsOfService') }}</a>
        {{ t('common.and') }} <a href="#">{{ t('auth.signin.privacyPolicy') }}</a>.
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
// 国际化
const { t } = useI18n()

// 设置布局
definePageMeta({
  layout: 'auth'
})

// 设置页面标题和meta
const keywords = t('auth.metadata.signin.keywords')
useSeoMeta({
  title: t('auth.metadata.signin.title'),
  description: t('auth.metadata.signin.description'),
  keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords
})
</script>

