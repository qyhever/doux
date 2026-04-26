const normalize = (index: number, length: number): number => ((index % length) + length) % length;

export const planPreloadOps = ({
  current,
  length,
  previousRetained,
}: {
  current: number;
  length: number;
  previousRetained: number[];
}) => {
  if (length <= 0) {
    return {
      acquire: [] as number[],
      release: previousRetained,
    };
  }

  const keep = [normalize(current, length), normalize(current + 1, length)];
  const releaseTarget = normalize(current - 2, length);
  const release = previousRetained.includes(releaseTarget) ? [releaseTarget] : [];

  return {
    acquire: keep,
    release,
  };
};
