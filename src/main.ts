import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import router from './router'
import pinia from './store'

const app = createApp(App)

// 配置路由
app.use(router)
// 配置pinia
app.use(pinia)


app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
