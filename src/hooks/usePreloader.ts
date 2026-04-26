const normalize = (index: number, length: number): number => ((index % length) + length) % length;

const uniqueInOrder = (indexes: number[]): number[] => {
  const seen = new Set<number>();
  return indexes.filter((index) => {
    if (seen.has(index)) return false;
    seen.add(index);
    return true;
  });
};

export const planPreloadOps = ({
  current,
  length,
  previousRetained,
  includeSecondNext = true,
}: {
  current: number;
  length: number;
  previousRetained: number[];
  includeSecondNext?: boolean;
}) => {
  if (length <= 0) {
    return {
      acquire: [] as number[],
      release: previousRetained,
    };
  }

  const keep = [
    normalize(current - 1, length),
    normalize(current, length),
    normalize(current + 1, length),
  ];

  if (includeSecondNext) {
    keep.push(normalize(current + 2, length));
  }

  const dedupedKeep = uniqueInOrder(keep);

  const release = previousRetained.filter((index) => !dedupedKeep.includes(index));

  return {
    acquire: dedupedKeep,
    release,
  };
};
