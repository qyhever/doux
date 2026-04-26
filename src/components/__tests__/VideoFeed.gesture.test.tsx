import { getCardPointerEvents, getCardStepOffset, performTransition } from '../videoFeed.logic';

describe('VideoFeed transition order', () => {
  it('commits index only after animation completes', async () => {
    const trace: string[] = [];

    await performTransition({
      animate: async () => {
        trace.push('animate-done');
      },
      commit: () => {
        trace.push('commit-done');
      },
    });

    expect(trace).toEqual(['animate-done', 'commit-done']);
  });

  it('maps adjacent videos and second-next video to card slots', () => {
    expect(getCardStepOffset({ currentIndex: 0, candidateIndex: 4, length: 5 })).toBe(-1);
    expect(getCardStepOffset({ currentIndex: 0, candidateIndex: 0, length: 5 })).toBe(0);
    expect(getCardStepOffset({ currentIndex: 0, candidateIndex: 1, length: 5 })).toBe(1);
    expect(getCardStepOffset({ currentIndex: 0, candidateIndex: 2, length: 5 })).toBe(2);
  });

  it('only allows active card to receive touch events', () => {
    expect(getCardPointerEvents({ currentIndex: 2, candidateIndex: 2 })).toBe('auto');
    expect(getCardPointerEvents({ currentIndex: 2, candidateIndex: 1 })).toBe('none');
    expect(getCardPointerEvents({ currentIndex: 2, candidateIndex: 3 })).toBe('none');
  });
});
