<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCounterStore } from "@store/counterStore";
import langMap from "@/locales/LangMap";
import { loginApi } from "@api/auth";

console.log("dev独有的环境变量：" + import.meta.env.VITE_DEV_PARAM);
const counterStore = useCounterStore();

const router = useRouter();
function goBack() {
  router.back();
}

async function add100() {
  const result = await counterStore.add100();
  console.log(result);
}

function login() {
  loginApi({ username: "lzp", password: "666" }).then((res) => {
    console.log(res);
  });
}
</script>

<template>
  <h1>{{ $t(langMap.app_title) }}</h1>
  <h1>
    当前的计数为：{{ counterStore.counter }} 双倍值为：{{
      counterStore.doubleCounter
    }}
  </h1>
  <ul>
    <li>
      <el-button type="success" @click="goBack">返回上一页</el-button>
    </li>
    <li>
      <el-icon size="25" color="red">
        <i-ep-edit />
      </el-icon>
    </li>
    <li>
      <el-button type="warning" @click="counterStore.counter++"
        >直接操作state去改变值</el-button
      >
    </li>
    <li>
      <el-button type="info" @click="counterStore.increment"
        >increment</el-button
      >
    </li>
    <li>
      <el-button type="success" @click="add100">异步加100</el-button>
    </li>
    <li>
      <Language></Language>
    </li>
    <li>
      <el-button type="primary" @click="login">登录请求</el-button>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
