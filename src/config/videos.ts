import { Platform } from 'react-native';

type VideoConfigItem = {
  fileName: string;
  videoName: string;
  cover?: string;
};

type VideoApiResponse = {
  code: number;
  message: string;
  data: VideoConfigItem[];
};

export type VideoItem = VideoConfigItem & {
  uri: string;
};

const WEB_VIDEO_API_BASE_URL =
  process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL ?? '/api';
const NATIVE_VIDEO_API_BASE_URL =
  process.env.EXPO_PUBLIC_VIDEO_API_NATIVE_BASE_URL ?? 'http://192.168.31.147:6304/api';
const VIDEO_API_BASE_URL =
  Platform.OS === 'web' ? WEB_VIDEO_API_BASE_URL : NATIVE_VIDEO_API_BASE_URL;
const VIDEO_FILE_BASE_URL = /^https?:\/\//i.test(VIDEO_API_BASE_URL)
  ? new URL('/videos/', VIDEO_API_BASE_URL).toString()
  : '/videos/';
const VIDEO_API_URL = `${VIDEO_API_BASE_URL}/video`;

const normalizeAssetUri = (value: string, baseUrl: string): string => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (!/^https?:\/\//i.test(baseUrl)) {
    if (value.startsWith('/')) {
      return value;
    }

    return `${baseUrl.replace(/\/$/, '')}/${value}`;
  }

  if (value.startsWith('/')) {
    return new URL(value, VIDEO_API_BASE_URL).toString();
  }

  return new URL(value, baseUrl).toString();
};

const toVideoItem = (item: VideoConfigItem): VideoItem => {
  return {
    ...item,
    cover: item.cover ? normalizeAssetUri(item.cover, VIDEO_API_BASE_URL) : item.cover,
    uri: normalizeAssetUri(item.fileName, VIDEO_FILE_BASE_URL),
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
