<template>
  <Button
    variant="outline"
    :class="cn('w-full bg-background hover:bg-accent hover:text-accent-foreground', className)"
    @click="$emit('click')"
    v-bind="$attrs"
  >
    <component :is="currentIcon" class="mr-2 h-4 w-4" />
    {{ providerNames[provider] }}
  </Button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { SocialProvider } from '@/types/auth'

// 导入SVG图标作为 Vue 组件
import GoogleIcon from '@libs/ui/icons/google.svg'
import GithubIcon from '@libs/ui/icons/github.svg'
import AppleIcon from '@libs/ui/icons/apple.svg'
import WeChatIcon from '@libs/ui/icons/wechat.svg'
import PhoneIcon from '@libs/ui/icons/phone.svg'

interface Props {
  provider: SocialProvider
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

// 定义事件
defineEmits<{
  click: []
}>()

// 国际化
const { t } = useI18n()

// 创建图标映射
const providerIcons = {
  google: GoogleIcon,
  github: GithubIcon,
  apple: AppleIcon,
  wechat: WeChatIcon,
  phone: PhoneIcon,
} as const

// 获取当前图标组件
const currentIcon = computed(() => providerIcons[props.provider])

// 创建提供商名称映射
const providerNames = computed(() => ({
  google: t('auth.signin.socialProviders.google'),
  github: t('auth.signin.socialProviders.github'),
  apple: t('auth.signin.socialProviders.apple'),
  wechat: t('auth.signin.socialProviders.wechat'),
  phone: t('auth.signin.socialProviders.phone'),
}))
</script> 