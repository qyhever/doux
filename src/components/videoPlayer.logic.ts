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
