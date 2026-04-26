import {
  createRetryGuard,
  getDisplayState,
  getIsBufferingFromStatus,
  getVideoPointerEvents,
  resolveMuted,
  togglePlayPause,
} from '../videoPlayer.logic';

describe('VideoPlayer display state', () => {
  it('prefers error state over buffering state', () => {
    expect(getDisplayState({ hasError: true, isBuffering: true })).toBe('error');
    expect(getDisplayState({ hasError: false, isBuffering: true })).toBe('buffering');
    expect(getDisplayState({ hasError: false, isBuffering: false })).toBe('playing');
  });

  it('keeps loading visible until the player is ready to play', () => {
    expect(getIsBufferingFromStatus('idle')).toBe(true);
    expect(getIsBufferingFromStatus('loading')).toBe(true);
    expect(getIsBufferingFromStatus('readyToPlay')).toBe(false);
    expect(getIsBufferingFromStatus('error')).toBe(false);
  });

  it('defaults to audible playback unless muted is explicitly enabled', () => {
    expect(resolveMuted()).toBe(false);
    expect(resolveMuted(false)).toBe(false);
    expect(resolveMuted(true)).toBe(true);
  });

  it('keeps the video surface from intercepting feed swipe gestures', () => {
    expect(getVideoPointerEvents()).toBe('none');
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

  it('toggles playback on demand', () => {
    const mockPlayer = {
      play: jest.fn(),
      pause: jest.fn(),
    };

    // When playing, should pause
    togglePlayPause(true, mockPlayer);
    expect(mockPlayer.pause).toHaveBeenCalled();
    expect(mockPlayer.play).not.toHaveBeenCalled();

    // Reset mocks
    mockPlayer.play.mockClear();
    mockPlayer.pause.mockClear();

    // When not playing, should play
    togglePlayPause(false, mockPlayer);
    expect(mockPlayer.play).toHaveBeenCalled();
    expect(mockPlayer.pause).not.toHaveBeenCalled();
  });
});
