import { planPreloadOps } from '../usePreloader';

describe('usePreloader rules', () => {
  it('keeps current+next and releases current-2', () => {
    const ops = planPreloadOps({ current: 3, length: 5, previousRetained: [1, 2, 3] });
    expect(ops.acquire.sort()).toEqual([3, 4]);
    expect(ops.release).toEqual([1]);
  });

  it('releases all retained when list is empty', () => {
    const ops = planPreloadOps({ current: 0, length: 0, previousRetained: [0, 1] });
    expect(ops.acquire).toEqual([]);
    expect(ops.release).toEqual([0, 1]);
  });
});
