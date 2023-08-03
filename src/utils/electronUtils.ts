import { ipcRenderer } from "electron";

/**
 * 新建一个窗口
 * @param path 路由地址
 * @param param 传递的参数
 */
export function openWindow(path: string, param?: Object) {
  let paramJsonStr = undefined;
  if (param) {
    paramJsonStr = JSON.stringify(param);
  }
  ipcRenderer.invoke("open-win", path, paramJsonStr);
}

/**
 * 显示加载进度条
 * @param isShow 是否显示加载进度条【底部工具栏图标显示】
 */
export function showProcess(isShow: boolean) {
  ipcRenderer.invoke("show-process", isShow);
}

/**
 * 事件广播
 * @param enevntInfo 事件对象
 */
export function eventBroadcast(enevntInfo: EventInfo) {
  ipcRenderer.invoke("event-broadcast", enevntInfo);
}

/**
 * 窗口是否可以跟随鼠标移动
 * @param flag
 */
export function windowMove(flag: boolean) {
  ipcRenderer.invoke("window-move-open", flag);
}

/**
 * 检查版本更新
 */
export function checkUpdate(){
  ipcRenderer.invoke("check-update");
}

export default {
  openWindow,
  showProcess,
  eventBroadcast,
  windowMove,
  checkUpdate
};
