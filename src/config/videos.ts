type VideoConfigItem = {
  fileName: string;
  videoName: string;
};

type VideoApiResponse = {
  code: number;
  message: string;
  data: VideoConfigItem[];
};

export type VideoItem = VideoConfigItem & {
  uri: string;
};

const VIDEO_API_BASE_URL =
  process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL ?? 'https://qyhever.com/eeao/api';
const VIDEO_FILE_BASE_URL = new URL('/videos/', VIDEO_API_BASE_URL).toString();
const VIDEO_API_URL = `${VIDEO_API_BASE_URL}/video`;

const normalizeVideoUri = (fileName: string): string => {
  if (/^https?:\/\//i.test(fileName)) {
    return fileName;
  }

  if (fileName.startsWith('/')) {
    return new URL(fileName, VIDEO_API_BASE_URL).toString();
  }

  return new URL(fileName, VIDEO_FILE_BASE_URL).toString();
};

const toVideoItem = (item: VideoConfigItem): VideoItem => {
  return {
    ...item,
    uri: normalizeVideoUri(item.fileName),
  };
};

export async function getVideos(): Promise<VideoItem[]> {
  const response = await fetch(VIDEO_API_URL);
  if (!response.ok) {
    throw new Error('视频列表请求失败');
  }

  const payload = (await response.json()) as VideoApiResponse;
  if (!Array.isArray(payload.data)) {
    throw new Error('视频列表数据格式错误');
  }

  return payload.data.map(toVideoItem);
}
