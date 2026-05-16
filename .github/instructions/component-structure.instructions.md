---
applyTo: "src/components/**"
description: "Use when editing UI components or component-adjacent logic files in doux."
---

# doux Component Structure Rules

- 组件名称使用 PascalCase，变量和函数使用 camelCase。
- 优先延续现有组件拆分方式：视图组件保留在 .tsx 文件，复杂手势、动画或切换逻辑可抽到同目录下的 .logic.ts 文件。
- 共享行为优先抽到 src/hooks/，共享类型优先放到 src/types/，不要把可复用逻辑长期堆在单个组件文件里。
- 涉及 react-native-gesture-handler、react-native-reanimated、react-native-worklets、expo-video 的改动时，尽量做局部修改，避免顺手升级依赖或重构原生相关配置。
- 如果一个页面组件只是装配层，具体表现逻辑优先落在 src/components/ 中，而不是反向塞回 app/。
- 新增组件前先复用现有模式，例如 VideoFeed.tsx 与同目录 logic 文件的拆分方式。

参考入口：
- .github/copilot-instructions.md
- src/components/VideoFeed.tsx
- src/components/videoFeed.logic.ts
- src/hooks/