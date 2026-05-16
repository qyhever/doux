import { getVideos } from './videos';

describe('getVideos', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maps remote video configs into playable videos', async () => {
    const fetchMock = jest.spyOn(global, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 1000,
        message: 'success',
        data: [{ fileName: 'demo.mp4', videoName: '示例视频' }],
      }),
    } as Response);

    const videos = await getVideos();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(videos).toEqual([
      {
        fileName: 'demo.mp4',
        videoName: '示例视频',
        uri: 'https://qyhever.com/videos/demo.mp4',
      },
    ]);
  });
});