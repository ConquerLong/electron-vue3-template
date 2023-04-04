<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      {{ map.get(currentLang) }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="langKey" :disabled="currentLang == langKey" v-for="langKey in langKeys">{{
          map.get(langKey) }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import langMap from '../locales/LangMap'

const i18n = useI18n()
// 获取所有lang的key 和 value
const langKeys = Object.keys(langMap.lang)
const langVavlues = Object.values(langMap.lang)
const map = new Map()
for (let i = 0; i < langKeys.length; i++) {
  map.set(langKeys[i], langVavlues[i])
}
// 计算属性获取i18n的值
const currentLang = computed(() => i18n.locale.value)

// 切换语言
function handleCommand(command: string) {
  i18n.locale.value = command
}

</script>
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
