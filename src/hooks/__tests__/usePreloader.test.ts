import { planPreloadOps } from '../usePreloader';

describe('usePreloader rules', () => {
  it('keeps previous current next and the second-next video', () => {
    const ops = planPreloadOps({ current: 3, length: 5, previousRetained: [1, 2, 3] });
    expect(ops.acquire.sort()).toEqual([0, 2, 3, 4]);
    expect(ops.release).toEqual([1]);
  });

  it('can prioritize next by delaying second-next preload', () => {
    const ops = planPreloadOps({
      current: 3,
      length: 5,
      previousRetained: [0, 1, 2, 3, 4],
      includeSecondNext: false,
    });

    expect(ops.acquire.sort()).toEqual([2, 3, 4]);
    expect(ops.release.sort()).toEqual([0, 1]);
  });

  it('deduplicates retained indexes when list is short', () => {
    const ops = planPreloadOps({
      current: 0,
      length: 2,
      previousRetained: [0, 1],
      includeSecondNext: true,
    });

    expect(ops.acquire.sort()).toEqual([0, 1]);
    expect(ops.release).toEqual([]);
  });

  it('releases all retained when list is empty', () => {
    const ops = planPreloadOps({ current: 0, length: 0, previousRetained: [0, 1] });
    expect(ops.acquire).toEqual([]);
    expect(ops.release).toEqual([0, 1]);
  });
});
