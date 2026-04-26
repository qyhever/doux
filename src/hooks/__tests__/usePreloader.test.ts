import { planPreloadOps } from '../usePreloader';

describe('usePreloader rules', () => {
  it('retains only current and previous when previous was already kept', () => {
    const ops = planPreloadOps({ current: 3, length: 5, previousRetained: [1, 2, 3] });
    expect(ops.acquire.sort()).toEqual([2, 3]);
    expect(ops.release.sort()).toEqual([1]);
  });

  it('keeps current and previous regardless of second-next flag', () => {
    const ops = planPreloadOps({
      current: 3,
      length: 5,
      previousRetained: [0, 1, 2, 3, 4],
      includeSecondNext: false,
    });

    expect(ops.acquire.sort()).toEqual([2, 3]);
    expect(ops.release.sort()).toEqual([0, 1, 4]);
  });

  it('does not retain wrapped previous at cold start', () => {
    const ops = planPreloadOps({
      current: 0,
      length: 5,
      previousRetained: [],
      includeSecondNext: false,
    });

    expect(ops.acquire.sort()).toEqual([0]);
    expect(ops.release).toEqual([]);
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
