# doux 代理工作指引

## 项目概览
- 这是一个基于 Expo 54、React Native 0.81、React 19 和 TypeScript 的移动端项目。
- 路由使用 expo-router，入口是 app/_layout.tsx；新增页面优先放在 app/ 下而不是自定义路由注册。
- UI 组件和业务逻辑主要放在 src/ 下，优先沿用现有目录和命名模式。

## 常用命令
- 安装依赖：npm install
- 启动开发服务：npm start
- 启动指定平台：npm run ios、npm run android
- 测试：npm test
- 类型检查：npm run typecheck
- Android 本地构建：npm run build:android

## 代码约定
- 优先使用 ES6+ 语法。
- 变量命名使用 camelCase，组件命名使用 PascalCase。
- 新增代码优先使用 React + TypeScript，保持函数和变量名可自解释。
- 复杂逻辑可以加简短注释，但不要堆砌解释性注释。
- 涉及用户输入、异步请求或原生能力调用时补充错误处理。

## 目录约定
- app/ 放路由文件和页面级布局。
- src/components/ 放可复用组件；如果已有 组件 + logic 拆分模式，新增功能优先保持一致。
- src/hooks/ 放共享 hooks，src/types/ 放共享类型。
- 原生工程在 android/ 和 ios/，除非任务明确要求，否则优先修改 JS/TS 层。

## 开发注意事项
- react-native-reanimated、react-native-worklets、expo-video 这类依赖对版本和原生配置敏感，避免无关升级。
- 如果 Android 构建报 SDK location not found，先检查 android/local.properties 或本机 ANDROID_HOME 配置。

## 文档入口
- 构建说明：README.md
- 本地脚本说明：scripts/index.local.md
- 需求文档：docs/requirements/requirement.md
- MVP 稳定性验收：docs/requirements/mvp-stability-acceptance-checklist.md
