# 简约版仿抖音 App

## 技术栈

- **平台**：React Native + Expo
- **视频播放**：expo-video
- **手势 / 动画**：react-native-gesture-handler + react-native-reanimated
- **状态管理**：React useReducer / useContext（轻量）

## 核心功能

1. **单页面全屏视频 Feed**：每次只展示一个视频，全屏显示
2. **手势切换（抖音同款）**：
   - 手指上滑 → 切换到下一个视频
   - 手指下滑 → 切换到上一个视频
   - 视频跟随手指实时移动，松手后弹性动画完成切换
   - 切换阈值：位移 > 屏幕高度 30% 或速度 > 500px/s
3. **视频来源**：Cloudflare R2 固定 URL 数组，维护在 `src/config/videos.ts`
4. **自动播放 + 默认静音**：进入屏幕立即自动播放，默认静音
5. **预加载策略**：同时预加载 **当前 + 下一个**视频（共 2 个），切换后释放 2 步以前的缓存
6. **循环播放**：滑到列表末尾后继续上滑，回到第一个视频

## 错误与加载状态

- **视频加载失败**：显示错误占位图 + "重试"按钮，点击重新触发加载
- **视频缓冲中**：在视频上层显示 loading 圆形指示器

## UI 展示（无交互）

- **底部 Tabbar**：仿抖音五 Tab（首页 / 朋友 / + / 消息 / 我），仅展示，无跳转
- **右侧互动按钮**：头像、点赞、评论、收藏、分享，竖向排列，显示占位数字，无点击
- **左下角视频信息**：`@用户名`、视频描述、音乐信息，仅展示

## 目录结构

```
doux/
├── app/
│   └── index.tsx                 # 主 Feed 页面入口（Expo Router）
└── src/
    ├── config/
    │   └── videos.ts             # Cloudflare R2 视频 URL 数组
    ├── components/
    │   ├── VideoPlayer.tsx       # 单视频播放器（自动播放/静音/预加载）
    │   ├── VideoFeed.tsx         # 手势切换容器
    │   ├── TabBar.tsx            # 底部 Tabbar（仅展示）
    │   ├── ActionButtons.tsx     # 右侧互动按钮（仅展示）
    │   ├── VideoInfo.tsx         # 左下角视频信息（仅展示）
    │   ├── LoadingOverlay.tsx    # 缓冲中遮罩
    │   └── ErrorPlaceholder.tsx  # 错误占位图 + 重试
    └── hooks/
        ├── useVideoFeed.ts       # 索引管理、循环、预加载调度
        └── usePreloader.ts       # 视频预加载逻辑
```

## 注意事项

- Cloudflare R2 需配置 CORS，允许 App 跨域请求
- iOS 静音模式下视频默认无声，使用 `Audio.setAudioModeAsync` 绕过
- 生产构建需使用 Expo Dev Client 或 EAS Build（gesture-handler 需原生支持）
