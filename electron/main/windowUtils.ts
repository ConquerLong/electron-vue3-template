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
    // 创建窗口对象
    const win = new BrowserWindow(
      Object.assign({}, defaultWindowConfig, windowConfig)
    );

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
    return win;
  }
}
