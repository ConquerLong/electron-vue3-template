import { BrowserWindow, screen } from "electron";
import BaseWindow from "./baseWindow";

/**
 * 窗口定位相关参数
 */
interface WindowPosition {
  x?: number; // 屏幕左上角开始x轴位置
  y?: number; // 屏幕左上角开始y轴位置
  relativeWindowId?: number; // 相对于某个窗口的位置/默认相对于屏幕
  position?: MyPosition; // 相对于屏幕或窗口的位置
  offsetX?: number; // 有position情况下的X轴偏移量
  offsetY?: number; // 有position情况下的Y轴偏移量
}

/**自定义定位类型 */
type MyPosition =
  | "center"
  | "bottom-left"
  | "bottom-right"
  | "top-right"
  | "top-left";

class WindowFunc extends BaseWindow {
  /**
   * 窗口事件绑定
   */
  private windowBindEvent(window: BrowserWindow) {
    const windowId = window.id;
    // 窗口关闭设置透明度为0
    window.on("close", () => window.setOpacity(0));

    // 窗口关闭后清除存储的窗口组
    window.on("closed", () => {
      delete this.group[windowId];
    });
  }

  /**
   * 修改窗口的位置
   * @param window 窗口对象
   * @param windowPosition 位置参数对象
   */
  changeWindowPostion(window: BrowserWindow, windowPosition: WindowPosition) {
    let x = windowPosition.x;
    let y = windowPosition.y;
    if (x != null && y != null) {
      // 如果是相对于某个窗口的话，加上相对窗口的x、y坐标
      if (windowPosition.relativeWindowId) {
        const relativeWin = BrowserWindow.fromId(
          windowPosition.relativeWindowId
        );
        if (relativeWin) {
          x += relativeWin.getPosition()[0];
          y += relativeWin.getPosition()[1];
        }
      }
      window.setPosition(x, y);
    }
    // 如果有定位
    if (windowPosition.position) {
      const winBounds = window.getBounds();
      let relativeBounds = screen.getDisplayMatching(winBounds).bounds;
      if (windowPosition.relativeWindowId) {
        const relativeWin = BrowserWindow.fromId(
          windowPosition.relativeWindowId
        );
        if (relativeWin) {
          relativeBounds = relativeWin.getBounds();
        }
      }

      // 偏移量补充
      const offsetX = windowPosition.offsetX || 0;
      const offsetY = windowPosition.offsetY || 0;
      console.log(offsetX, offsetY);

      // 计算坐标
      switch (windowPosition.position) {
        case "center":
          window.setPosition(
            relativeBounds.x +
              (relativeBounds.width - winBounds.width) / 2 +
              offsetX,
            relativeBounds.y +
              (relativeBounds.height - winBounds.height) / 2 +
              offsetY
          );
          break;
        case "bottom-left":
          window.setPosition(
            relativeBounds.x + offsetX,
            relativeBounds.y +
              relativeBounds.height -
              winBounds.height +
              offsetY
          );
          break;
        case "bottom-right":
          window.setPosition(
            relativeBounds.x + relativeBounds.width - winBounds.width + offsetX,
            relativeBounds.y +
              relativeBounds.height -
              winBounds.height +
              offsetY
          );
          break;
        case "top-left":
          window.setPosition(
            relativeBounds.x + offsetX,
            relativeBounds.y + offsetY
          );
          break;
        case "top-right":
          window.setPosition(
            relativeBounds.x + relativeBounds.width - winBounds.width + offsetX,
            relativeBounds.y + offsetY
          );
          break;
      }
    }
  }

  /**
   * 设置窗体加载的页面
   * @param route 页面对应路由地址
   */
  setWindowLoad(route: string, window: BrowserWindow) {
    // 开发环境走url请求，生产环境走本地页面路径
    // if (!app.isPackaged) {
    //   window.loadURL(`${url}#${route}`);
    //   // 如果是开发环境，新窗口默认打开开发工具
    //   // window.webContents.openDevTools();
    // } else {
    //   window.loadFile(indexHtmlPath, { hash: route });
    // }
  }

  /**
   * 通过页面路由获取对应窗口的id
   * @param route 页面路由
   */
  getIdByRoute(route: string): number {
    for (const id in this.group) {
      if (this.group[id].route === route) {
        return Number(id);
      }
    }
    return null;
  }

  /**
   * 通过页面路由获取WebContentsId 用于窗口通信
   * @param route 页面路由
   */
  getWebContentsIdByRoute(route: string): number {
    for (const id in this.group) {
      if (this.group[id].route === route) {
        const win = this.getWindow(Number(id));
        if (win) {
          return win.webContents.id;
        }
      }
    }
    return null;
  }

  /**
   * 修改窗口的大小
   * @param window 窗口对象
   * @param width 宽度
   * @param height 高度
   */
  changeWindowSize(window: BrowserWindow, width?: number, height?: number) {
    const wh = window.getSize();
    if (width) {
      wh[0] = width;
    }
    if (height) {
      wh[1] = height;
    }
    window.setSize(wh[0], wh[1], true);
  }

  /**
   * 通过wenContentsId获取所在窗口
   * @param webContentsId 窗口的webContentsId
   */
  getWindowByWebContentsId(webContentsId: number): BrowserWindow {
    // 如果没有传winId，则关闭当前窗口
    for (const currentWin of BrowserWindow.getAllWindows()) {
      if (currentWin.webContents.id === webContentsId) {
        return currentWin;
      }
    }
    return null;
  }
}
