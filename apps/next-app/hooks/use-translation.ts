'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { translations, type SupportedLocale, defaultLocale, locales, type Translations } from '@libs/i18n';
import { createNextTranslationFunction } from '@libs/validators';

export function useTranslation() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params?.lang as SupportedLocale) || defaultLocale;
  const t = translations[locale] as Translations;

  // 创建支持参数插值的翻译函数
  const tWithParams = createNextTranslationFunction(t);

  const changeLocale = (newLocale: SupportedLocale) => {
    // Get the current path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`);
    
    // Store the preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
  };

  return {
    t,
    tWithParams, // 新增：支持参数插值的翻译函数
    locale,
    locales,
    defaultLocale,
    changeLocale,
    isDefaultLocale: locale === defaultLocale,
  } as const;
} 