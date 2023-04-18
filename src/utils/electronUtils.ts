import { ipcRenderer } from "electron";

/**
 * 新建一个窗口
 * @param path 路由地址
 */
export function openWindow(path: string) {
  ipcRenderer.invoke("open-win");
}

/**
 * 显示加载进度条
 * @param isShow 是否显示加载进度条【底部工具栏图标显示】
 */
export function showProcess(isShow: boolean) {
  ipcRenderer.invoke("show-prosess", isShow);
}

export default {
  openWindow,
  showProcess,
};
