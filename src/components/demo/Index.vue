<template>
  <h1>{{ $t(langMap.app_title) }}</h1>
  <h1>这是demo页 当前计数为：{{ counterStore.counter }}</h1>
  <ul>
    <li><router-link to="/hello">链接跳转helloworld页</router-link></li>
    <li><router-link to="/demo/mockDemo">mockjs案例</router-link></li>
    <li><router-link to="/demo/mockApiDemo">前端模拟接口</router-link></li>
    <li><router-link to="/demo/sassDemo">sassDemo</router-link></li>
    <li>
      <el-select
        v-model="windowPath"
        value-key=""
        placeholder="输入路由地址"
        clearable
        filterable
      >
        <el-option
          v-for="path in routerPaths"
          :key="path"
          :label="path"
          :value="path"
        >
        </el-option>
      </el-select>
      <el-button @click="openWindow">新建窗口</el-button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCounterStore } from "@store/counterStore";
import { ref } from "vue";
import electronUtils from "@/utils/electronUtils";
import langMap from "@/locales/langMap";
const counterStore = useCounterStore();
const router = useRouter();

const windowPath = ref("/hello");
const routerPaths = ref<string[]>([]);
// 取到所有的路径
routerPaths.value = router.getRoutes().map((item) => item.path);

function openWindow() {
  electronUtils.openWindow(windowPath.value);
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
