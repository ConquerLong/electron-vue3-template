<template>
  <h1>{{ $t(langMap.app_title) }}</h1>
  <h1>这是demo页 当前计数为：{{ counterStore.counter }}</h1>
  <ul>
    <li><router-link to="/hello">链接跳转helloworld页</router-link></li>
    <li><router-link to="/demo/mockDemo">mockjs案例</router-link></li>
    <li><router-link to="/demo/mockApiDemo">前端模拟接口</router-link></li>
    <li><router-link to="/demo/sassDemo">sassDemo</router-link></li>
    <li><router-link to="/demo/themeDemo">themeDemo</router-link></li>
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
import myUtils from "@/utils/myUtils";

const counterStore = useCounterStore();
const router = useRouter();

console.log("mac地址为：", myUtils.getMacAddress());

const windowPath = ref("/hello");
const routerPaths = ref<string[]>([]);
// 取到所有的路径
routerPaths.value = router.getRoutes().map((item) => item.path);

function openWindow() {
  electronUtils.openWindow(windowPath.value, {
    message: "向你问个好~~",
  });
}

let lzp = {
  name: "lzp",
  likes: {
    sports: new Map<string, string>([
      ["k1", "v1"],
      ["k2", "v2"],
    ]),
  },
  game: new Map<string, string>([
    ["kk1", "vv1"],
    ["kk2", "vv2"],
  ]),
};

console.log("自定义工具类进行序列化");
console.log(myUtils.stringify(lzp));
</script>

<style scoped lang="scss">
h1 {
  color: $primaryColor;
}
ul {
  list-style: none;
}
</style>
