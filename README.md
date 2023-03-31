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

3. 如果依赖安装失败，使用cnpm装

```cmd
# 安装cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org 
# 使用cnpm安装依赖
cnpm i
```

# 必装插件

- eslint    语法检测
- prettier  代码格式化
- volar [安装两个]
  - 一个基础 vue 语法提示
  - 一个 ts 版语法提示

# 推荐插件
+ Element Plus Snippets [大量element代码块]
+ Vue VSCode Snippets   [大量vue代码块]


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