# 抖音 MVP 稳定性收敛 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在不新增业务功能的前提下，收敛现有短视频 Feed 的状态流、预加载和错误恢复链路，优先保证中高端机上的稳定与流畅。

**架构：** 以 `useVideoFeed` 作为索引单一事实来源，`VideoFeed` 负责手势输入与切换编排，`usePreloader` 负责窗口化资源调度，`VideoPlayer` 负责单视频状态机。通过“动画完成后提交索引”与“切换中并发保护”消除错位和闪屏。通过明确状态优先级和单路径重试提升故障恢复一致性。

**技术栈：** React Native + Expo、TypeScript、react-native-reanimated、react-native-gesture-handler、expo-video、Jest

---

## 文件结构（先锁定职责）

- 修改：`src/hooks/useVideoFeed.ts`
- 修改：`src/hooks/usePreloader.ts`
- 修改：`src/components/VideoFeed.tsx`
- 修改：`src/components/VideoPlayer.tsx`
- 修改：`src/components/LoadingOverlay.tsx`
- 修改：`src/components/ErrorPlaceholder.tsx`
- 创建：`src/hooks/__tests__/useVideoFeed.test.ts`
- 创建：`src/hooks/__tests__/usePreloader.test.ts`
- 创建：`src/components/__tests__/VideoPlayer.state.test.tsx`
- 创建：`src/components/__tests__/VideoFeed.gesture.test.tsx`
- 创建：`docs/requirements/mvp-stability-acceptance-checklist.md`

职责说明：
- `useVideoFeed.ts`：索引变更、首尾循环、阈值判定结果落地、切换并发保护。
- `usePreloader.ts`：仅维护“当前 + 下一个”的 acquire/release 生命周期。
- `VideoFeed.tsx`：手势输入采集与动画编排；不承担缓存策略。
- `VideoPlayer.tsx`：单视频 `error/buffering/playing` 状态机与单路径重试。
- `LoadingOverlay.tsx`、`ErrorPlaceholder.tsx`：仅表现层，逻辑由上层注入。
- 测试文件：覆盖索引/循环/阈值、预加载窗口、状态优先级、重试防抖、切换并发保护。

### 任务 1：收敛索引状态机与循环边界

**文件：**
- 修改：`src/hooks/useVideoFeed.ts`
- 测试：`src/hooks/__tests__/useVideoFeed.test.ts`

- [ ] **步骤 1：编写失败测试（循环边界 + 阈值判定）**

```ts
import { decideSwitch, normalizeIndex } from '../useVideoFeed';

describe('useVideoFeed core rules', () => {
  it('normalizes index for loop boundaries', () => {
    expect(normalizeIndex(-1, 5)).toBe(4);
    expect(normalizeIndex(5, 5)).toBe(0);
  });

  it('switches when distance or velocity passes threshold', () => {
    expect(decideSwitch({ dy: -350, vy: -100, height: 1000 })).toBe('next');
    expect(decideSwitch({ dy: -50, vy: -600, height: 1000 })).toBe('next');
    expect(decideSwitch({ dy: -100, vy: -100, height: 1000 })).toBe('stay');
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- src/hooks/__tests__/useVideoFeed.test.ts --runInBand`
预期：FAIL，报错 `decideSwitch` 或 `normalizeIndex` 未导出。

- [ ] **步骤 3：实现最少代码使测试通过**

```ts
export type SwitchDecision = 'prev' | 'next' | 'stay';

export const normalizeIndex = (index: number, length: number) => {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
};

export const decideSwitch = ({
  dy,
  vy,
  height,
}: {
  dy: number;
  vy: number;
  height: number;
}): SwitchDecision => {
  const distanceThreshold = height * 0.3;
  const velocityThreshold = 500;

  if (dy <= -distanceThreshold || vy <= -velocityThreshold) return 'next';
  if (dy >= distanceThreshold || vy >= velocityThreshold) return 'prev';
  return 'stay';
};
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- src/hooks/__tests__/useVideoFeed.test.ts --runInBand`
预期：PASS。

- [ ] **步骤 5：Commit**

```bash
git add src/hooks/useVideoFeed.ts src/hooks/__tests__/useVideoFeed.test.ts
git commit -m "test+feat: 收敛索引循环与切换阈值判定"
```

### 任务 2：增加切换并发保护（动画期间禁止并发提交）

**文件：**
- 修改：`src/hooks/useVideoFeed.ts`
- 测试：`src/hooks/__tests__/useVideoFeed.test.ts`

- [ ] **步骤 1：编写失败测试（切换门闩）**

```ts
import { createTransitionGate } from '../useVideoFeed';

it('blocks concurrent transition commit when lock is active', () => {
  const gate = createTransitionGate();
  expect(gate.tryLock()).toBe(true);
  expect(gate.tryLock()).toBe(false);
  gate.release();
  expect(gate.tryLock()).toBe(true);
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- src/hooks/__tests__/useVideoFeed.test.ts --runInBand`
预期：FAIL，报错 `createTransitionGate` 未定义。

- [ ] **步骤 3：实现最少代码**

```ts
export const createTransitionGate = () => {
  let locked = false;

  return {
    tryLock() {
      if (locked) return false;
      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
    isLocked() {
      return locked;
    },
  };
};
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- src/hooks/__tests__/useVideoFeed.test.ts --runInBand`
预期：PASS。

- [ ] **步骤 5：Commit**

```bash
git add src/hooks/useVideoFeed.ts src/hooks/__tests__/useVideoFeed.test.ts
git commit -m "feat: 增加切换并发保护门闩"
```

### 任务 3：收敛预加载窗口为“当前 + 下一个”并释放“当前 - 2”

**文件：**
- 修改：`src/hooks/usePreloader.ts`
- 测试：`src/hooks/__tests__/usePreloader.test.ts`

- [ ] **步骤 1：编写失败测试（窗口与释放规则）**

```ts
import { planPreloadOps } from '../usePreloader';

it('keeps current+next and releases current-2', () => {
  const ops = planPreloadOps({ current: 3, length: 5, previousRetained: [1, 2, 3] });
  expect(ops.acquire.sort()).toEqual([3, 4]);
  expect(ops.release).toEqual([1]);
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- src/hooks/__tests__/usePreloader.test.ts --runInBand`
预期：FAIL，报错 `planPreloadOps` 未定义。

- [ ] **步骤 3：实现最少代码**

```ts
const normalize = (index: number, length: number) => ((index % length) + length) % length;

export const planPreloadOps = ({
  current,
  length,
  previousRetained,
}: {
  current: number;
  length: number;
  previousRetained: number[];
}) => {
  const keep = [normalize(current, length), normalize(current + 1, length)];
  const release = previousRetained.filter((i) => !keep.includes(i));

  return {
    acquire: keep,
    release,
  };
};
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- src/hooks/__tests__/usePreloader.test.ts --runInBand`
预期：PASS。

- [ ] **步骤 5：Commit**

```bash
git add src/hooks/usePreloader.ts src/hooks/__tests__/usePreloader.test.ts
git commit -m "feat: 收敛预加载窗口与释放策略"
```

### 任务 4：统一播放器状态优先级与单路径重试

**文件：**
- 修改：`src/components/VideoPlayer.tsx`
- 修改：`src/components/ErrorPlaceholder.tsx`
- 修改：`src/components/LoadingOverlay.tsx`
- 测试：`src/components/__tests__/VideoPlayer.state.test.tsx`

- [ ] **步骤 1：编写失败测试（error > buffering > playing）**

```tsx
import { getDisplayState } from '../VideoPlayer';

it('prefers error state over buffering state', () => {
  expect(getDisplayState({ hasError: true, isBuffering: true })).toBe('error');
  expect(getDisplayState({ hasError: false, isBuffering: true })).toBe('buffering');
  expect(getDisplayState({ hasError: false, isBuffering: false })).toBe('playing');
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- src/components/__tests__/VideoPlayer.state.test.tsx --runInBand`
预期：FAIL，报错 `getDisplayState` 未导出。

- [ ] **步骤 3：实现最少代码（含重试防抖）**

```ts
export type DisplayState = 'error' | 'buffering' | 'playing';

export const getDisplayState = ({
  hasError,
  isBuffering,
}: {
  hasError: boolean;
  isBuffering: boolean;
}): DisplayState => {
  if (hasError) return 'error';
  if (isBuffering) return 'buffering';
  return 'playing';
};

export const createRetryGuard = () => {
  let pending = false;
  return async (retryFn: () => Promise<void>) => {
    if (pending) return;
    pending = true;
    try {
      await retryFn();
    } finally {
      pending = false;
    }
  };
};
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- src/components/__tests__/VideoPlayer.state.test.tsx --runInBand`
预期：PASS。

- [ ] **步骤 5：Commit**

```bash
git add src/components/VideoPlayer.tsx src/components/ErrorPlaceholder.tsx src/components/LoadingOverlay.tsx src/components/__tests__/VideoPlayer.state.test.tsx
git commit -m "feat: 统一播放器状态优先级与重试防抖"
```

### 任务 5：收敛手势容器的切换编排（先动画后提交）

**文件：**
- 修改：`src/components/VideoFeed.tsx`
- 测试：`src/components/__tests__/VideoFeed.gesture.test.tsx`

- [ ] **步骤 1：编写失败测试（动画回调后才提交索引）**

```tsx
import { performTransition } from '../VideoFeed';

it('commits index only after animation completes', async () => {
  const trace: string[] = [];
  await performTransition({
    animate: async () => trace.push('animate-done'),
    commit: () => trace.push('commit-done'),
  });
  expect(trace).toEqual(['animate-done', 'commit-done']);
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- src/components/__tests__/VideoFeed.gesture.test.tsx --runInBand`
预期：FAIL，报错 `performTransition` 未导出。

- [ ] **步骤 3：实现最少代码**

```ts
export const performTransition = async ({
  animate,
  commit,
}: {
  animate: () => Promise<void>;
  commit: () => void;
}) => {
  await animate();
  commit();
};
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- src/components/__tests__/VideoFeed.gesture.test.tsx --runInBand`
预期：PASS。

- [ ] **步骤 5：Commit**

```bash
git add src/components/VideoFeed.tsx src/components/__tests__/VideoFeed.gesture.test.tsx
git commit -m "feat: 收敛切换时序为先动画后提交索引"
```

### 任务 6：补充验收清单并执行回归

**文件：**
- 创建：`docs/requirements/mvp-stability-acceptance-checklist.md`

- [ ] **步骤 1：编写失败测试（文档存在性检查）**

```bash
test -f docs/requirements/mvp-stability-acceptance-checklist.md
```

- [ ] **步骤 2：运行检查验证失败**

运行：`test -f docs/requirements/mvp-stability-acceptance-checklist.md`
预期：FAIL（退出码非 0）。

- [ ] **步骤 3：创建验收清单文档**

```md
# MVP 稳定性验收清单

- [ ] 连续上滑 20 次无明显错位或方向误判
- [ ] 连续下滑 20 次无明显错位或方向误判
- [ ] 首尾循环无黑屏和索引错乱
- [ ] 弱网下可出现 loading，但无卡死
- [ ] 无效视频地址出现错误占位，重试可恢复
- [ ] 持续滑动 3-5 分钟体感无持续恶化
```

- [ ] **步骤 4：运行检查验证通过**

运行：`test -f docs/requirements/mvp-stability-acceptance-checklist.md && echo OK`
预期：输出 `OK`。

- [ ] **步骤 5：Commit**

```bash
git add docs/requirements/mvp-stability-acceptance-checklist.md
git commit -m "docs: 新增MVP稳定性验收清单"
```

## 全量验证步骤（任务完成后执行）

- [ ] 运行：`npm test -- --runInBand`
- [ ] 运行：`npm run lint`
- [ ] 运行：`npm run typecheck`
- [ ] 手动验收：按 `docs/requirements/mvp-stability-acceptance-checklist.md` 逐项勾选

预期结果：测试、Lint、类型检查全部通过；手动验收项全部通过。
