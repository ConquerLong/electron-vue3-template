import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
} from "electron";
import {
  url,
  appTitle,
  preloadPath,
  iconPath,
  indexHtmlPath,
} from "./common/variables";
import { CustomChannel } from "../../globel/channelEvent";

/* ======================= 定义一些窗口工具类中会使用到的常量，以及窗口顶级父类 ========================= */

// 默认窗口参数
export const defaultWindowConfig: BrowserWindowConstructorOptions &
  IWindowConfig = {
  title: appTitle,
  icon: iconPath,
  width: 800,
  height: 600,
  webPreferences: {
    webviewTag: true,
    preload: preloadPath,
    nodeIntegration: true,
    contextIsolation: false,
  },
};

/**
 * 窗口管理顶级父类 定义一些属性，和公共方法
 */
export class WindowUtils {
  group: Map<string, WindowGroup>; // 窗口组 key就是传入的key值，如果没传，则取窗口的id作为key值

  /**
   * 构造方法，初始化属性
   */
  constructor() {
    this.group = new Map();
  }

  // 事件监听处理
  listen() {
    // 窗口创建监听
    ipcMain.handle(CustomChannel.window_create, (_, opt: IWindowConfig) => {
      this.createWindows(opt);
    });
  }

  /**
   * 创建窗口
   * @param windowConfig 窗口创建参数
   */
  createWindows(windowConfig: IWindowConfig): BrowserWindow {
    // 先通过key判断是否已窗口，有则聚焦
    let windowKey = windowConfig.key;
    if (windowKey && windowKey.length > 0) {
      /// 先从窗口组中取出记录
      const wg: WindowGroup = this.group.get(windowKey);
      if (wg) {
        /// 根据记录中的窗口id获取窗口，假如存在该窗口，则聚焦该窗口
        const oldWin = BrowserWindow.fromId(wg.windowId);
        if (oldWin) {
          oldWin.focus();
          return oldWin;
        }
      }
    }

    // 创建窗口对象
    const win = new BrowserWindow(
      Object.assign({}, defaultWindowConfig, windowConfig)
    );

    // 将窗口的关键信息与key关联，存入窗口组中
    windowKey = windowKey || win.id.toString();
    this.group.set(windowKey, {
      windowId: win.id,
      webContentsId: win.webContents.id,
    });

    // 根据当前环境加载页面，并传递参数
    const param = windowConfig.param
      ? "?urlParamData=" + windowConfig.param
      : "";
    if (process.env.VITE_DEV_SERVER_URL) {
      // 如果是开发环境，则直接访问本地跑起的服务，拼接对应的路由
      win.loadURL(`${url}#${windowConfig.route}${param}`);
    } else {
      // 如果是线上环境，则加载html文件的路径，然后拼接路由
      win.loadFile(indexHtmlPath, { hash: windowConfig.route + param });
    }

    // 绑定通用窗口事件
    this.bindWindowEvent(win, windowConfig);
    console.log(this.group);
    return win;
  }

  /**
   * 绑定窗口事件
   * @param win 窗口对象
   * @param windowConfig 窗口创建参数
   */
  bindWindowEvent(win: BrowserWindow, windowConfig: IWindowConfig) {
    // 窗口关闭监听，此事件触发时，窗口即将关闭，可以拒绝关闭，此时窗口对象还未销毁
    win.on("close", () => {
      /// 设置窗口透明
      win.setOpacity(0);
      /// 在窗口组中删除
      const key = windowConfig.key || win.id.toString();
      this.group.delete(key);
    });

    // 此事件触发时，窗口已关闭，窗口对象已销毁
    win.on("closed", () => {
      // 在窗口对象被关闭时，取消订阅所有与该窗口相关的事件
      win.removeAllListeners();
      // 引用置空
      win = null;
    });
  }
}
