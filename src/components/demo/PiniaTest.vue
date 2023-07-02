<template>
  <div class="pinia-box">
    <ul>
      <li>
        当前值为{{ counterStore.counter }}
        <el-button @click="counterStore.counter++">自增count</el-button>
      </li>
      <li>
        <el-button @click="triggerInterval"
          >{{ timerFlag ? "关闭" : "开启" }}定时自增
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/store/modules/counterStore";
import { ref } from "vue";

const counterStore = useCounterStore();
const timerFlag = ref(false);
let timer: NodeJS.Timer | undefined;
// 开始定时器
function triggerInterval() {
  timerFlag.value = !timerFlag.value;
  if (timerFlag.value) {
    timer = setInterval(() => {
      counterStore.counter++;
    }, 1000);
  }else {
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
  }
}
</script>

<style scoped lang="scss">
.pinia-box {
  width: 100%;
}
</style>
