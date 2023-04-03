# 开始

1. 配置 npm 镜像

```cmd
# 指定 npm 国内镜像
npm config set registry=https://registry.npm.taobao.org/
# 指定 Electron 的国内镜像地址
npm config set electron_mirror=https://npm.taobao.org/mirrors/electron/
```

2. 安装依赖

```cmd
npm i
```

3. 如果依赖安装失败，使用 cnpm 装

```cmd
# 安装cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 使用cnpm安装依赖
cnpm i
```

# 工程目录结构

```diff
+ ├─┬ electron
+ │ ├─┬ main
+ │ │ └── index.ts    Electron主进程入口
+ │ └─┬ preload
+ │   └── index.ts    预加载ts脚本
  ├─┬ src
  │ ├── main.ts       Electron-渲染进程入口[即vue相关页面构建代码]
  | ├── assets        静态资源目录
  | ├── components    封装的vue组件目录
  | ├── directive     自定义指令
  | ├── hooks         组合式函数封装
  | ├── locales       国际化，多语言支持
  | ├── store         全局状态管理
  | └── utils         ts工具类
  ├── index.html
  ├── package.json
  └── vite.config.ts
```

# 必装插件

- eslint 语法检测
- prettier 代码格式化
- volar [安装两个]
  - 一个基础 vue 语法提示
  - 一个 ts 版语法提示

# 推荐插件

- Element Plus Snippets [大量 element 代码块]
- Vue VSCode Snippets [大量 vue 代码块]
- Markdown All in One [预览 md 文件]
- Markdown Preview GitHub Styling [github 风格的 md 预览]

# 常用操作

## 速查手册

[vite 官方文档](https://cn.vitejs.dev/guide/)  
[vue3 官方文档](https://cn.vuejs.org/guide/components/props.html)  
[element-plus](https://element-plus.org/zh-CN/component/button.html)  
[vue-router](https://router.vuejs.org/zh/guide/)  
[sass 官方文档](https://www.sass.hk/docs/)  
[ts 菜鸟教程](https://www.runoob.com/typescript/ts-object.html)  
[electron 官方文档](https://www.electronjs.org/zh/docs/latest/api/app)  
[element-plus](https://element-plus.org/zh-CN/component/button.html)  
[pinia 官方文档](https://pinia.web3doc.top/introduction.html)

## 使用 element 的图标

所有图标直接看官网：[https://element-plus.org/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88](https://element-plus.org/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88)  
调整为 i-ep-xx 即可

```html
<el-icon size="25" color="red">
  <i-ep-edit />
</el-icon>
```
