import { useState, useCallback } from 'react';
import { VIDEO_URLS } from '../config/videos';

export function useVideoFeed() {
  const total = VIDEO_URLS.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + total) % total);
  }, [total]);

  return { currentIndex, goNext, goPrev, total };
}
