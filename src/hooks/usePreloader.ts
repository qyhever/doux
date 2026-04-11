import { useMemo } from 'react';
import { VIDEO_URLS } from '../config/videos';

export function usePreloader(currentIndex: number) {
  const total = VIDEO_URLS.length;

  const activeIndices = useMemo(() => {
    if (total <= 1) return [currentIndex];
    return [currentIndex, (currentIndex + 1) % total];
  }, [currentIndex, total]);

  return { activeIndices };
}
