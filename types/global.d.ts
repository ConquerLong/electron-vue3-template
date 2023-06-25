/** 一些全局的对象补充声明 */
export {};
declare global {
  // 通用事件对象
  interface EventInfo {
    channel: string; // 对应渲染层监听管道
    body: string; // JSON序列化后的消息内容
  }
}
