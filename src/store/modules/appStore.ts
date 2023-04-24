import { defineStore } from "pinia";
import cacheUtils from "@/utils/cacheUtils";

/**应用相关状态管理 */
export const useAppStore = defineStore("appStore", {
  state() {
    return {
      lang: cacheUtils.get("lang") || "zhCn", // app的语言
    };
  },
});
