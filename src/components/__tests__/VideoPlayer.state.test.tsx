import {
  createRetryGuard,
  formatTime,
  getPlaybackProgress,
  getDisplayState,
  getIsBufferingFromStatus,
  getVideoPointerEvents,
  resolveMuted,
  shouldPauseOnAppForeground,
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

  it('calculates playback progress within 0..1 range', () => {
    expect(getPlaybackProgress(5, 10)).toBe(0.5);
    expect(getPlaybackProgress(-1, 10)).toBe(0);
    expect(getPlaybackProgress(20, 10)).toBe(1);
    expect(getPlaybackProgress(2, 0)).toBe(0);
    expect(getPlaybackProgress(Number.NaN, 10)).toBe(0);
  });

  it('formats seconds into m:ss string', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(59)).toBe('0:59');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(-1)).toBe('0:00');
    expect(formatTime(Number.NaN)).toBe('0:00');
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

  it('pauses playback only when returning from background to foreground', () => {
    expect(shouldPauseOnAppForeground('background', 'active')).toBe(true);
    expect(shouldPauseOnAppForeground('inactive', 'active')).toBe(true);

    expect(shouldPauseOnAppForeground('active', 'active')).toBe(false);
    expect(shouldPauseOnAppForeground('active', 'inactive')).toBe(false);
    expect(shouldPauseOnAppForeground('background', 'inactive')).toBe(false);
  });
});
