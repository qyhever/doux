import { createTransitionGate, decideSwitch, normalizeIndex } from '../useVideoFeed';

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

  it('blocks concurrent transition commit when lock is active', () => {
    const gate = createTransitionGate();
    expect(gate.tryLock()).toBe(true);
    expect(gate.tryLock()).toBe(false);
    gate.release();
    expect(gate.tryLock()).toBe(true);
  });
});
