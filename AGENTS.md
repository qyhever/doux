# Repository Guidelines

## 项目结构与模块组织

这是一个使用 Expo Router 的 Expo React Native 应用。路由入口文件位于 `app/`，其中 `app/index.tsx` 当前挂载主视频流。应用代码组织在 `src/` 下：可复用 UI 位于 `src/components/`，Hooks 和纯视频流逻辑位于 `src/hooks/`，视频配置与加载逻辑位于 `src/config/`。测试文件放在对应模块附近的 `__tests__` 目录中，或以 `*.test.ts` 命名并放在 `src/` 下。静态资源位于 `assets/`，原生项目位于 `android/` 和 `ios/`，发布 APK 存放在 `release/android/`，产品与实现说明位于 `docs/`。

## 构建、测试与开发命令

- `npm run start`: 通过 `dotenv-cli` 加载 `.env` 并启动 Expo。
- `npm run android` / `npm run ios` / `npm run web`: 为指定目标启动 Expo。
- `npm run run:android` / `npm run run:ios`: 在本地构建并运行原生应用。
- `npm test`: 运行由 `jest.config.js` 配置的 Jest 测试。
- `npm run lint` 或 `npm run typecheck`: 使用严格 TypeScript 配置运行 `tsc --noEmit`。
- `npm run build:android:release`: 构建 Android release APK，并导出按 ABI 拆分的产物。

进行 Android 原生构建前，请确保已设置 `ANDROID_HOME`/`ANDROID_SDK_ROOT`，或创建包含 `sdk.dir=...` 的 `android/local.properties`。

## 编码风格与命名约定

使用 TypeScript 和 React 函数组件。遵循现有风格：2 空格缩进、单引号、分号、组件文件使用 `PascalCase`，函数与 Hooks 使用 `camelCase`。Hooks 以 `use` 开头；纯决策逻辑放在 `.logic.ts` 或 Hook 模块中；共享数据优先导出明确类型，例如 `VideoItem`。

## 测试指南

Jest 使用 `ts-jest` 和 `node` 环境，并且只扫描 `src`。请在相关代码旁添加聚焦的单元测试，命名示例包括 `Component.behavior.test.tsx` 或 `useHook.test.ts`。修改手势或播放行为前，应覆盖纯切换逻辑、预加载逻辑和错误状态逻辑。提交 PR 前运行 `npm test` 和 `npm run typecheck`。

## 提交与 Pull Request 指南

Git 历史使用 Conventional Commit 前缀并搭配中文摘要，例如 `feat: 更新视频播放器...`、`fix: ...`、`test: ...` 和 `chore: ...`。提交应保持范围清晰，并使用祈使语气。PR 应包含简短说明、测试结果、相关 issue 或需求文档链接；涉及 UI 变更时附上截图或录屏。修改原生文件、EAS 配置或发布脚本时，请说明对 Android/iOS 构建的影响。

## Agent 专用说明

除非任务明确涉及打包，否则不要覆盖已生成的发布产物。原生项目改动应保持最小范围；编辑后请验证 TypeScript 检查和相关 Jest 覆盖。
