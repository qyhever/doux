import { performTransition } from '../VideoFeed';

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
});
