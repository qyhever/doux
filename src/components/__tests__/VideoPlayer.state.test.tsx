import { createRetryGuard, getDisplayState } from '../videoPlayer.logic';

describe('VideoPlayer display state', () => {
  it('prefers error state over buffering state', () => {
    expect(getDisplayState({ hasError: true, isBuffering: true })).toBe('error');
    expect(getDisplayState({ hasError: false, isBuffering: true })).toBe('buffering');
    expect(getDisplayState({ hasError: false, isBuffering: false })).toBe('playing');
  });

  it('debounces concurrent retries', async () => {
    const guard = createRetryGuard();
    let calls = 0;

    const retry = async () => {
      calls += 1;
      await Promise.resolve();
    };

    await Promise.all([guard(retry), guard(retry), guard(retry)]);
    expect(calls).toBe(1);
  });
});
