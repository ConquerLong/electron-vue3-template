import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  nativeTheme,
  screen,
  IpcMainEvent,
  session,
} from "electron";


// const win = new BrowserWindow({
//   title: "Main window",
//   icon: join(process.env.PUBLIC, "icons/icon.ico"),
//   webPreferences: {
//     webviewTag: true,
//     preload,
//     // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
//     // Consider using contextBridge.exposeInMainWorld
//     // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
//     nodeIntegration: true,
//     contextIsolation: false,
//   },
// });