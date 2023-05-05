/** 一些全局的对象补充声明 */
export {};
declare global {
  /**
   * 窗口配置参数
   */
  interface WindowConfig {
    /**
     * 窗口宽度
     */
    width?: 666;
    /**
     * 窗口高度
     */
    height?: 666;
    /**
     * 窗口最小高度
     */
    minHeight?: 666;
    /**
     * 窗口最大高度
     */
    minWidth?: 666;
    /**
     * 路由地址
     */
    route: string;
    /**
     * 通过url传递的参数
     */
    param?: Object;
  }
}
