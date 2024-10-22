import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  //  hash 模式。
  history: createWebHashHistory(),
  routes: [
    // 设置首页
    {
      path: "/",
      component: () =>
        G_IS_BUILD
          ? import("../components/HelloWorld.vue")
          : import("../components/demo/Index.vue"),
    },
    // 配置helloworld页的路径
    {
      path: "/hello",
      component: () => import("../components/HelloWorld.vue"),
    },
    /** ================= 放置各种操作的demo ============== */
    {
      path: "/demo",
      component: () => import("../components/demo/Index.vue"),
    },
    {
      path: "/demo/mockDemo",
      component: () => import("../components/demo/MockDemo.vue"),
    },
    {
      path: "/demo/mockApiDemo",
      component: () => import("../components/demo/MockApiDemo.vue"),
    },
    {
      path: "/demo/sassDemo",
      component: () => import("@/components/demo/SassDemo.vue"),
    },
    {
      path: "/demo/themeDemo",
      component: () => import("@/components/demo/ThemeDemo.vue"),
    },
    {
      path: "/demo/piniaTest",
      component: () => import("@/components/demo/PiniaTest.vue"),
    },
    {
      path: "/demo/ipcDemo",
      component: () => import("@/components/demo/ipcDemo.vue"),
    },
    {
      path: "/demo/windowPositionDemo",
      component: () => import("@/components/demo/WindowPositionDemo.vue"),
    },
  ],
});

export default router;
