import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  nativeTheme,
  Tray,
} from "electron";
import { join } from "node:path";

const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

export default class BaseWindow {
  mainWin: BrowserWindow | null;
  group: IGroup;
  tray: Tray | null;

  constructor() {
    this.mainWin = null;
    this.group = {}; //窗口组
    this.tray = null; //托盘
    this.initMain();
  }
  /**
   * 初始化主窗口
   */
  private initMain() {
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

  // 获取窗口
  getWindow(id: number): BrowserWindow {
    return BrowserWindow.fromId(id);
  }
}
