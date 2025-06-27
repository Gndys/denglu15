import { translations } from '@libs/i18n'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'zh-CN', // 与 nuxt.config.ts 中的 defaultLocale 保持一致
    messages: translations
  }
})
