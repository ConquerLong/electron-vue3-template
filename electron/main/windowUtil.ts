import { app, BrowserWindow, shell, ipcMain, nativeTheme } from "electron";
import { join } from "node:path";

const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

export class WindowUtil {
  mainWin: BrowserWindow | null;

  constructor() {
    this.mainWin = null;
  }
  /**
   * 初始化主窗口
   */
  initMain() {
    this.mainWin = new BrowserWindow({
      title: "Main window",
      icon: join(process.env.PUBLIC, "favicon.ico"),
      webPreferences: {
        preload,
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      this.mainWin.loadURL(url);
      this.mainWin.webContents.openDevTools();
    } else {
      this.mainWin.loadFile(indexHtml);
    }
  }
  /**
   * 新建窗口
   * @param windowConfig
   */
  openWindow(windowConfig: WindowConfig) {}
}

const mainBrow = new BrowserWindow({
  width: 666,
  height: 666,
  minHeight: 666,
  minWidth: 666,
  frame: true,
  transparent: true,
  x: 666,
  y: 666,
});
