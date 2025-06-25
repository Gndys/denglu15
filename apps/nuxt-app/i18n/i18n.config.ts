import { translations } from '@libs/i18n'
console.log('translations123', translations)
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages:translations
  }
})
