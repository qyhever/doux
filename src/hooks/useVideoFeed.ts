export type SwitchDecision = 'prev' | 'next' | 'stay';

export const normalizeIndex = (index: number, length: number): number => {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
};

export const decideSwitch = ({
  dy,
  vy,
  height,
}: {
  dy: number;
  vy: number;
  height: number;
}): SwitchDecision => {
  const distanceThreshold = height * 0.15;
  const velocityThreshold = 300;

  if (dy <= -distanceThreshold || vy <= -velocityThreshold) return 'next';
  if (dy >= distanceThreshold || vy >= velocityThreshold) return 'prev';
  return 'stay';
};

export const createTransitionGate = () => {
  let locked = false;

  return {
    tryLock() {
      if (locked) return false;
      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
    isLocked() {
      return locked;
    },
  };
};
