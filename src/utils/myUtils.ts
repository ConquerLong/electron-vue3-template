import { ElLoading, ElMessage } from 'element-plus';

// 服务调用的Loading是全局单例的，这里直接获取
let loading = ElLoading.service();
loading.close();

/**
 * 通用工具类封装
 */
interface MyUtils {
  /**通用对象判空 */
  isEmpty(obj: any): boolean;

  /**
   * 显示加载层
   * @param text 文本显示
   * @param time 持续时间
   */
  showLoading(text?: string, time?: number): void;

  /**隐藏加载层 */
  hideLoading(): void;

  /**
   * 消息提示
   * @param text 文本
   * @param type  类型
   * @param time  持续时间
   * @param showClose  是否可以关闭
   */
  message(
    text: string,
    type?: 'success' | 'warning' | 'error' | 'info' | 'danger',
    time?: number,
    showClose?: boolean
  ): void;
}

const myUtils: MyUtils = {
  /**
   * 通用空判断
   * @param obj
   */
  isEmpty: (obj: any) => {
    // 空对象判空
    if (obj === undefined || obj === null || obj === '') {
      return true;
    }
    // 空数组判断
    if (Array.isArray(obj)) {
      return obj.length === 0;
    }
    // set集合判空
    if (obj instanceof Set) {
      return (obj as Set<any>).size === 0;
    }
    return false;
  },

  /**
   * 显示加载层
   * @param text 显示的文本内容
   * @param time 持续时间
   */
  showLoading: (text?: string, time?: number) => {
    // 显示加载层
    loading = ElLoading.service({
      lock: true,
      text: text || 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
      fullscreen: true
    });
    if (time) {
      setTimeout(() => {
        myUtils.hideLoading();
      }, time);
    }
  },

  /**
   * 隐藏加载层
   */
  hideLoading: () => {
    if (loading) {
      loading.close();
    }
  },

  /**
   * 提示消息简单封装
   * @param text 消息文本
   * @param type 消息类型
   * @param time 持续时间
   * @param showClose 是否显示删除按钮
   */
  message: (
    text: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info',
    time = 2000,
    showClose = false
  ) => {
    //// 警告消息
    ElMessage({
      message: text,
      type: type,
      duration: time,
      showClose: showClose
    });
  }
};

export default myUtils;
