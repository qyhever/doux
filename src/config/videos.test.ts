const mockVideoResponse = {
  code: 1000,
  message: 'success',
  data: [{ fileName: 'demo.mp4', videoName: '示例视频', cover: 'demo.jpg' }],
};

const loadVideosModule = async (platform: 'ios' | 'web') => {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    Platform: { OS: platform },
  }));

  return import('./videos');
};

describe('getVideos', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.dontMock('react-native');
  });

  it('uses the native API base URL outside web', async () => {
    const fetchMock = jest
      .spyOn(globalThis as unknown as { fetch: () => Promise<Response> }, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => mockVideoResponse,
      } as Response);
    const { getVideos } = await loadVideosModule('ios');

    const videos = await getVideos();

    expect(fetchMock).toHaveBeenCalledWith('http://192.168.31.147:6304/api/video');
    expect(videos).toEqual([
      {
        fileName: 'demo.mp4',
        videoName: '示例视频',
        cover: 'http://192.168.31.147:6304/demo.jpg',
        uri: 'http://192.168.31.147:6304/videos/demo.mp4',
      },
    ]);
  });

  it('uses the web proxy API base URL on web', async () => {
    const fetchMock = jest
      .spyOn(globalThis as unknown as { fetch: () => Promise<Response> }, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => mockVideoResponse,
      } as Response);
    const { getVideos } = await loadVideosModule('web');

    const videos = await getVideos();

    expect(fetchMock).toHaveBeenCalledWith('/api/video');
    expect(videos).toEqual([
      {
        fileName: 'demo.mp4',
        videoName: '示例视频',
        cover: '/api/demo.jpg',
        uri: '/videos/demo.mp4',
      },
    ]);
  });
});
