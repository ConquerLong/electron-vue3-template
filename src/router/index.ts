import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  //  hash 模式。
  history: createWebHashHistory(),
  routes: [
    // 设置首页
    {
      path: '/',
      component: () => import('../components/demo/Index.vue')
    },
    // 配置helloworld页的路径
    { 
      path: '/hello', 
      component: () => import('../components/HelloWorld.vue') 
    },
  ],
})


export default router