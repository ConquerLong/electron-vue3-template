<template>
  <h1>这是demo页 当前计数为：{{ counterStore.counter }}</h1>
  <ul>
    <li><router-link to="/hello">链接跳转helloworld页</router-link></li>
    <li><router-link to="/demo/mockDemo">mockjs案例</router-link></li>
    <li><router-link to="/demo/mockApiDemo">前端模拟接口</router-link></li>
    <li><router-link to="/demo/sassDemo">sassDemo</router-link></li>
  </ul>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCounterStore } from "@store/counterStore";

const counterStore = useCounterStore();
const router = useRouter();

// 点击事件跳转对应页面
function goTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
