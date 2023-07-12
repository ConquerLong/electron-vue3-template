<template>
  <div class="pinia-box">
    <ul>
      <li>
        当前值为{{ counterStore.counter }}
        <el-button @click="counterStore.counter++">自增count</el-button>
      </li>
      <li>
        并发测试：
        <el-button @click="triggerInterval"
          >{{ timerFlag ? "关闭" : "开启" }}定时自增
        </el-button>
      </li>
      <li>
        <el-button @click="cacheUtils.clear()" type="danger"
          >清空缓存
        </el-button>
      </li>
      <li>
        <div>多属性测试</div>
        <span @click="counterStore.flag1 = !counterStore.flag1"
          >{{ counterStore.flag1 }}|
        </span>
        <span @click="counterStore.flag2 = !counterStore.flag2"
          >{{ counterStore.flag2 }}|
        </span>
        <span @click="counterStore.flag3 = !counterStore.flag3"
          >{{ counterStore.flag3 }}|
        </span>
        <span @click="counterStore.flag4 = !counterStore.flag4"
          >{{ counterStore.flag4 }}|
        </span>
        <span @click="counterStore.flag5 = !counterStore.flag5"
          >{{ counterStore.flag5 }}
        </span>
      </li>
      <li>
        <el-button @click="mapAdd">当状态属性为map时测试添加内容 </el-button>
      </li>
      <li>
        counterStore中的map的值为：
        <ul>
          <li v-for="item of counterStore.map.entries()" :key="item[0]">
            {{ item[0] }} —— {{ item[1] }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/store/modules/counterStore";
import { computed, ref } from "vue";
import cacheUtils from "@/utils/cacheUtils";

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
  } else {
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
  }
}

// map集合插值
function mapAdd() {
  counterStore.counter++;
  console.log(counterStore.map);
  counterStore.map.set(
    counterStore.counter + "",
    counterStore.counter + "_" + counterStore.counter
  );
}
</script>

<style scoped lang="scss">
.pinia-box {
  width: 100%;
}
</style>
