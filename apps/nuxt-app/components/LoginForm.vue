<template>
  <div :class="cn('flex flex-col gap-4', className)">
    <!-- 显示错误信息 -->
    <FormError v-if="errorMessage" :message="errorMessage" :code="errorCode" />
    
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <div class="grid gap-6">
        <!-- 邮箱输入 -->
        <div class="grid gap-2">
          <Label for="email">{{ t('auth.signin.email') }}</Label>
          <div class="relative">
            <Input
              id="email"
              v-bind="emailAttrs"
              v-model="email"
              type="email"
              :placeholder="t('auth.signin.emailPlaceholder')"
              :class="cn(errors.email && 'border-destructive')"
              :aria-invalid="errors.email ? 'true' : 'false'"
              autocomplete="email"
            />
            <span v-if="errors.email" class="text-destructive text-xs absolute -bottom-5 left-0">
              {{ errors.email }}
            </span>
          </div>
        </div>

        <!-- 密码输入 -->
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">{{ t('auth.signin.password') }}</Label>
            <NuxtLink
              :to="localePath('/forgot-password')"
              class="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {{ t('auth.signin.forgotPassword') }}
            </NuxtLink>
          </div>
          <div class="relative">
            <Input
              id="password"
              v-bind="passwordAttrs"
              v-model="password"
              type="password"
              :class="cn(errors.password && 'border-destructive')"
              :aria-invalid="errors.password ? 'true' : 'false'"
              autocomplete="current-password"
            />
            <span v-if="errors.password" class="text-destructive text-xs absolute -bottom-5 left-0">
              {{ errors.password }}
            </span>
          </div>
        </div>

        <!-- Captcha 组件 (如果启用) -->
        <div v-if="captchaEnabled" class="grid gap-2">
          <VueTurnstile
            ref="turnstileRef"
            :site-key="captchaSiteKey"
            v-model="turnstileToken"
            size="flexible"
            @error="onTurnstileError"
            @expired="onTurnstileExpired"
            :theme="isDark ? 'dark' : 'light'"
          />
          <span v-if="turnstileError" class="text-destructive text-xs">
            {{ turnstileError }}
          </span>
        </div>

        <!-- 记住我选项 -->
        <div class="flex items-center space-x-2">
          <input
            id="remember"
            v-bind="rememberAttrs"
            v-model="remember"
            type="checkbox"
            class="border-primary text-primary ring-offset-background focus-visible:ring-ring h-4 w-4 rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
          <Label for="remember" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {{ t('auth.signin.rememberMe') }}
          </Label>
        </div>

        <!-- 提交按钮 -->
        <Button 
          type="submit" 
          class="w-full" 
          :disabled="loading || isSubmitting || (captchaEnabled && !turnstileToken)"
        >
          {{ loading ? t('auth.signin.submitting') : t('auth.signin.submit') }}
        </Button>
      </div>

      <!-- 注册链接 -->
      <div class="text-center text-sm">
        {{ t('auth.signin.noAccount') }}
        <NuxtLink :to="localePath('/signup')" class="underline underline-offset-4">
          {{ t('auth.signin.signupLink') }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { createValidators } from '@libs/validators'
import { authClientVue } from '@libs/auth/authClient'
import { cn } from '@/lib/utils'
import VueTurnstile from 'vue-turnstile'

interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

// 国际化和导航
const { t } = useI18n()
const localePath = useLocalePath()
const { locale } = useI18n()

// 状态管理
const loading = ref(false)
const errorMessage = ref('')
const errorCode = ref('')

// 获取运行时配置
const runtimeConfig = useRuntimeConfig()

// Captcha 相关状态
const captchaEnabled = computed(() => {
  // 使用环境变量或默认为 true
  return runtimeConfig.public.captchaEnabled !== 'false'
})

const captchaSiteKey = computed(() => {
  // 使用 Nuxt 的公共环境变量
  const siteKey = runtimeConfig.public.turnstileSiteKey as string | undefined
  return siteKey || '1x00000000000000000000AA' // 测试用 key
})

const turnstileToken = ref('')
const turnstileError = ref('')
const turnstileRef = ref()

// 主题检测 (简化版本)
const isDark = ref(false)

// Turnstile 事件处理
const onTurnstileError = () => {
  turnstileError.value = t('auth.signin.captchaError')
  turnstileToken.value = ''
}

const onTurnstileExpired = () => {
  turnstileError.value = t('auth.signin.captchaExpired')
  turnstileToken.value = ''
}

// 创建国际化验证器
const { loginFormSchema } = createValidators(t)

// 表单验证
const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginFormSchema),
  initialValues: {
    email: '',
    password: '',
    remember: true
  }
})

// 定义表单字段
const [email, emailAttrs] = defineField('email', {
  validateOnBlur: true
})
const [password, passwordAttrs] = defineField('password', {
  validateOnBlur: true  
})
const [remember, rememberAttrs] = defineField('remember')

// 处理表单提交
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  errorMessage.value = ''
  errorCode.value = ''
  turnstileError.value = ''

  // 验证 captcha (如果启用)
  if (captchaEnabled.value && !turnstileToken.value) {
    turnstileError.value = t('auth.signin.captchaRequired')
    loading.value = false
    return
  }

  try {
    const fetchOptions: any = {}
    
    // 如果启用了 captcha，添加 captcha token 到请求头
    if (captchaEnabled.value && turnstileToken.value) {
      fetchOptions.headers = {
        'x-captcha-response': turnstileToken.value
      }
    }

    const result = await authClientVue.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: `/${locale.value}`,
      ...(values.remember ? { rememberMe: true } : {}),
      fetchOptions
    })

    // 检查是否有错误
    if (result && 'error' in result && result.error) {
      const error = result.error
      if (error.code && error.message) {
        errorMessage.value = t('auth.signin.errors.invalidCredentials')
        errorCode.value = error.code
      } else {
        errorMessage.value = t('auth.signin.errors.invalidCredentials')
        errorCode.value = 'UNKNOWN_ERROR'
      }
    } else if (result && 'user' in result) {
      // 登录成功，重定向到仪表盘
      await navigateTo(localePath('/dashboard'))
    } else {
      // 未知响应格式
      errorMessage.value = t('auth.signin.errors.invalidCredentials')
      errorCode.value = 'UNEXPECTED_RESPONSE'
    }
  } catch (err) {
    errorMessage.value = t('auth.signin.errors.invalidCredentials')
    errorCode.value = 'UNEXPECTED_ERROR'
  } finally {
    loading.value = false
  }
})
</script> 