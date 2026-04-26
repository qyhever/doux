const normalize = (index: number, length: number): number => ((index % length) + length) % length;

export const getCardStepOffset = ({
  currentIndex,
  candidateIndex,
  length,
}: {
  currentIndex: number;
  candidateIndex: number;
  length: number;
}): -1 | 0 | 1 | 2 | null => {
  if (length <= 0) return null;

  if (candidateIndex === normalize(currentIndex - 1, length)) return -1;
  if (candidateIndex === normalize(currentIndex, length)) return 0;
  if (candidateIndex === normalize(currentIndex + 1, length)) return 1;
  if (candidateIndex === normalize(currentIndex + 2, length)) return 2;

  return null;
};

export const performTransition = async ({
  animate,
  commit,
}: {
  animate: () => Promise<void>;
  commit: () => void;
}) => {
  await animate();
  commit();
};

export const getCardPointerEvents = ({
  currentIndex,
  candidateIndex,
}: {
  currentIndex: number;
  candidateIndex: number;
}): 'auto' | 'none' => {
  return candidateIndex === currentIndex ? 'auto' : 'none';
};
