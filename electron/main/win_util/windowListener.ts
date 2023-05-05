import { ipcMain } from "electron";
import BaseWindow from "./baseWindow";

/**主进程事件监听 */
class WindowListener extends BaseWindow {
  litener() {
    ipcMain.on("", (_, param) => {
      console.log(param);
    });
  }
}
