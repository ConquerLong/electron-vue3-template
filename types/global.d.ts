/** 一些全局的对象补充声明 */
export {};
declare global {
  // 通用事件对象
  interface EventInfo {
    channel: string; // 对应渲染层监听管道
    body: string; // JSON序列化后的消息内容
  }

  // 窗口创建参数规范
  interface IWindowConfig {
    key?: string; // 窗口唯一key，不传则取窗口的id，假如已存在该key则聚焦该窗口
    route?: string; // 窗口路由
    width?: number; // 窗口宽度
    height?: number; // 窗口高度
    param?: string; // 传递参数，新窗口打开时能直接从路由中获取，拼接url传递，推荐只传小数据
  }
}
