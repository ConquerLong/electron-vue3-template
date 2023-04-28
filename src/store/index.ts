import { createPinia } from "pinia";
import { shareStorePlugin } from "./plugins/shareStorePlugin";

const pinia = createPinia();

// 添加状态共享插件
pinia.use(shareStorePlugin);

export default pinia;
