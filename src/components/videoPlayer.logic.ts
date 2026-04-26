import { VideoPlayerStatus } from 'expo-video';
import { AppStateStatus, ViewProps } from 'react-native';

export type DisplayState = 'error' | 'buffering' | 'playing';

export const resolveMuted = (muted?: boolean): boolean => muted ?? false;

export const getVideoPointerEvents = (): ViewProps['pointerEvents'] => 'none';

export const togglePlayPause = (isPlaying: boolean, player: any): void => {
  if (isPlaying) {
    player.pause();
  } else {
    player.play();
  }
};

export const getIsBufferingFromStatus = (status?: VideoPlayerStatus): boolean => {
  if (status === 'readyToPlay' || status === 'error') {
    return false;
  }

  return true;
};

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

export const shouldPauseOnAppForeground = (
  previousState: AppStateStatus,
  nextState: AppStateStatus,
): boolean => {
  const wasInBackground = previousState === 'background' || previousState === 'inactive';
  return wasInBackground && nextState === 'active';
};
