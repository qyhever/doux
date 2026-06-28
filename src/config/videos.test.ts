import { getVideos } from './videos';

describe('getVideos', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maps remote video configs into playable videos', async () => {
    const fetchMock = jest
      .spyOn(globalThis as unknown as { fetch: () => Promise<Response> }, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          code: 1000,
          message: 'success',
          data: [{ fileName: 'demo.mp4', videoName: '示例视频', cover: 'demo.jpg' }],
        }),
      } as Response);

    const videos = await getVideos();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(videos).toEqual([
      {
        fileName: 'demo.mp4',
        videoName: '示例视频',
        cover: 'https://qyhever.com/eeao/demo.jpg',
        uri: 'https://qyhever.com/videos/demo.mp4',
      },
    ]);
  });
});
