---
applyTo: "app/**"
description: "Use when editing Expo Router pages or layout files in doux."
---

# doux Expo Router Rules

- app/ 目录使用 expo-router 文件路由；新增页面优先直接放在 app/ 下并通过文件命名表达路由结构。
- 根布局入口是 app/_layout.tsx；全局导航容器、手势根节点和页面级默认 screenOptions 优先在这里维护。
- 页面文件尽量保持轻量，优先组合 src/components/ 中已有组件，而不是在页面里堆叠大量业务逻辑。
- 如果页面只是某个核心组件的承载层，保持类似 app/index.tsx 的简单包装风格。
- 需要改动需求或验收口径时，不要把文档内容复制进说明里，直接查看 docs/requirements/requirement.md 和 docs/requirements/mvp-stability-acceptance-checklist.md。

参考入口：
- .github/copilot-instructions.md
- app/_layout.tsx
- app/index.tsx