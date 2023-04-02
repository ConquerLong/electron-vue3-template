<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '../store/modules/counterStore'

const counterStore = useCounterStore()

const router = useRouter()
function goBack() {
  router.back()
}

</script>

<template>
  <h1>当前的计数为：{{ counterStore.counter }}  双倍值为：{{ counterStore.doubleCounter }}</h1>
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
      <el-button type="warning" @click="counterStore.counter++">直接操作state去改变值</el-button>
    </li>
    <li>
      <el-button type="info" @click="counterStore.increment">increment</el-button>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    list-style: none;
  }
</style>
