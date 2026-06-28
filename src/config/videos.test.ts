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
  const originalVideoApiBaseUrl = process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL;
  const originalNativeVideoApiBaseUrl =
    process.env.EXPO_PUBLIC_VIDEO_API_NATIVE_BASE_URL;

  afterEach(() => {
    process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL = originalVideoApiBaseUrl;
    process.env.EXPO_PUBLIC_VIDEO_API_NATIVE_BASE_URL =
      originalNativeVideoApiBaseUrl;
    jest.restoreAllMocks();
    jest.dontMock('react-native');
  });

  it('uses the native API base URL outside web', async () => {
    delete process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL;
    delete process.env.EXPO_PUBLIC_VIDEO_API_NATIVE_BASE_URL;
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

  it('uses the shared production API base URL on native when no native override is set', async () => {
    process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL = 'https://qyhever.com/eeao/api';
    delete process.env.EXPO_PUBLIC_VIDEO_API_NATIVE_BASE_URL;
    const fetchMock = jest
      .spyOn(globalThis as unknown as { fetch: () => Promise<Response> }, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => mockVideoResponse,
      } as Response);
    const { getVideos } = await loadVideosModule('ios');

    const videos = await getVideos();

    expect(fetchMock).toHaveBeenCalledWith('https://qyhever.com/eeao/api/video');
    expect(videos).toEqual([
      {
        fileName: 'demo.mp4',
        videoName: '示例视频',
        cover: 'https://qyhever.com/eeao/demo.jpg',
        uri: 'https://qyhever.com/videos/demo.mp4',
      },
    ]);
  });

  it('uses the web proxy API base URL on web', async () => {
    delete process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL;
    delete process.env.EXPO_PUBLIC_VIDEO_API_NATIVE_BASE_URL;
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
