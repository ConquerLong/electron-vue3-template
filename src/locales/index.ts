import { createI18n } from 'vue-i18n'
import en from './packages/en'
import zhCn from './packages/zh-cn'

// 2. Create i18n instance with options
const i18n = createI18n({
  legacy: false, // 解决Not available in legacy mode报错
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: 'zhCn', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en, zhCn
  }, // set locale messages
})


export default i18n