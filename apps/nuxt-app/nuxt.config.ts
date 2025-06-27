// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
import { loadEnv } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import svgLoader from 'vite-svg-loader';


// 加载根目录的环境变量
const rootEnv = loadEnv('', resolve(__dirname, '../..'), '')

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
      svgLoader({
        defaultImport: 'component', // 默认导入为 Vue 组件
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false, // 保留 viewBox 属性
                },
              },
            },
          ],
        },
      }),
    ],
    optimizeDeps: {
      include: ['pg', 'drizzle-orm']
    }
  },

  // 配置Nitro以支持CommonJS模块
  nitro: {
    rootDir: resolve(__dirname, '../..'),
    experimental: {
      wasm: true
    },
    commonJS: {
      include: [/pg/, /drizzle-orm/]
    }
  },

  // 配置环境变量
  runtimeConfig: {
    // 服务端环境变量
    databaseUrl: rootEnv.DATABASE_URL,
    betterAuthSecret: rootEnv.BETTER_AUTH_SECRET,
    
    // 公共环境变量（客户端可访问）
    public: {
      betterAuthUrl: rootEnv.BETTER_AUTH_URL,
      apiBaseUrl: rootEnv.API_BASE_URL,
      // Captcha 配置
      captchaEnabled: rootEnv.CAPTCHA_ENABLED || 'true',
      turnstileSiteKey: rootEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY || rootEnv.TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
    }
  },

  // 配置路径别名
  alias: {
    "@": resolve(__dirname, '.'),
    "@libs": resolve(__dirname, '../../libs'),
    "@config": resolve(__dirname, '../../config.ts'),
  },

  // 配置构建选项以支持CommonJS
  build: {
    transpile: ['pg', 'drizzle-orm']
  },

  modules: ['shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/i18n'],
  
  // 国际化配置
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'zh-CN',
        name: '中文',
      }
    ],
    defaultLocale: 'zh-CN',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'NEXT_LOCALE',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'zh-CN'
    },
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }

})