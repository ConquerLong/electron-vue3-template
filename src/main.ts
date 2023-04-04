import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import router from './router'
import pinia from './store'
import i18n from './locales'

const app = createApp(App)

// 配置路由
app.use(router)
// 配置pinia
app.use(pinia)
// 配置国际化
app.use(i18n)

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
