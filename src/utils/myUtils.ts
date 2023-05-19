import { ElLoading, ElMessage } from "element-plus";
const urlParamKey = "urlParamData=";
/**
 * 返回url传输的对象
 */
export const getParamFromUrl = function (): any {
  const url = decodeURIComponent(document.location.href);
  const index = url.indexOf(urlParamKey);
  if (index >= 0) {
    return JSON.parse(url.substring(index + urlParamKey.length));
  }
  return null;
};

/**
 * 提示消息简单封装
 * @param text 消息文本
 * @param type 消息类型
 * @param time 持续时间
 * @param showClose 是否显示删除按钮
 */
export const message = (
  text: string,
  type: "success" | "warning" | "error" | "info" = "info",
  time = 2000,
  showClose = false
) => {
  //// 警告消息
  ElMessage({
    message: text,
    type: type,
    duration: time,
    showClose: showClose,
  });
};

export default {
  getParamFromUrl,
  message,
};
