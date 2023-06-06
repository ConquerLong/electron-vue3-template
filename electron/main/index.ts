import { app, BrowserWindow, shell, ipcMain, nativeTheme } from "electron";
import { release } from "node:os";
import { join } from "node:path";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// 注册协议
const PROTOCOL = "lzpelectrondemo";
/**添加注册表信息 用于浏览器启动客户端 */
function registerScheme() {
  const args = [];
  if (!app.isPackaged) {
    // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
    args.push(join(process.argv[1]));
  }
  // 加一个 `--` 以确保后面的参数不被 Electron 处理
  args.push("--");
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);
  handleArgv(process.argv);
}
// 处理浏览器打开应用的启动参数信息
function handleArgv(argv: string[]) {
  const prefix = `${PROTOCOL}:`;
  // 开发阶段，跳过前两个参数（`electron.exe .`）
  // 打包后，跳过第一个参数（`myapp.exe`）
  const offset = app.isPackaged ? 1 : 2;
  const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix));
  if (url) handleUrl(url);
}
// 处理url请求
function handleUrl(url: string) {
  // tuiroom://joinroom?roomId=123
  const urlObj = new URL(url);
  const { searchParams } = urlObj;
  const schemeRoomId = searchParams.get("roomId") || "";
  if (win && win.webContents) {
    win?.webContents.send("launch-app", schemeRoomId);
  }
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      webviewTag: true,
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}
// 注册协议，用于浏览器打开应用
registerScheme();
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
app.on("open-url", (event, urlStr) => {
  handleUrl(urlStr);
});

/**
 * 新建一个窗口
 * route=>路由地址  paramJsonStr => 序列化后的参数对象
 */
ipcMain.handle("open-win", (_, route: string, paramJsonStr: string) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const paramData = paramJsonStr ? "?urlParamData=" + paramJsonStr : "";
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${route}${paramData}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: route + paramData });
  }
});

/**
 * show : ture 显示app进度条，false，关闭显示
 */
let progressInterval;
ipcMain.handle("show-process", (event, show: boolean) => {
  const INCREMENT = 0.03;
  const INTERVAL_DELAY = 100; // ms

  let c = 0;
  if (show) {
    progressInterval = setInterval(() => {
      win.setProgressBar(c);
      if (c < 2) {
        c += INCREMENT;
      } else {
        c = -INCREMENT * 5;
      }
    }, INTERVAL_DELAY);
  } else {
    c = 0;
    win.setProgressBar(c);
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  }
});

/**语言修改同步 */
ipcMain.handle("lang:change", (event, lang) => {
  // 通知所有窗口同步更改语言
  for (const currentWin of BrowserWindow.getAllWindows()) {
    const webContentsId = currentWin.webContents.id;
    // 这里排除掉发送通知的窗口
    if (webContentsId !== event.sender.id) {
      currentWin.webContents.send("lang:change", lang);
    }
  }
});

// 主题样式修改同步
ipcMain.handle(
  "theme-style:change",
  (event, mode?: "system" | "light" | "dark") => {
    if (mode && "system,light,dark".indexOf(mode) >= 0) {
      nativeTheme.themeSource = mode;
    }
    // 通知所有窗口同步更改样式
    // 遍历window执行
    for (const currentWin of BrowserWindow.getAllWindows()) {
      const webContentsId = currentWin.webContents.id;
      if (webContentsId !== event.sender.id) {
        currentWin.webContents.send("theme-style:changed", mode);
      }
    }
  }
);

/**pinia多窗口共享 */
ipcMain.handle(
  "pinia-store-change",
  (event, storeName: string, jsonStr: string, isResetVersion: boolean) => {
    // 遍历window执行
    for (const currentWin of BrowserWindow.getAllWindows()) {
      const webContentsId = currentWin.webContents.id;
      if (webContentsId !== event.sender.id) {
        currentWin.webContents.send(
          "pinia-store-set",
          storeName,
          jsonStr,
          isResetVersion
        );
      }
    }
  }
);
