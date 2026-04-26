declare module 'expo-video' {
  export type VideoSource = {
    uri: string;
    metadata?: Record<string, string>;
  };

  export type VideoPlayerHandle = {
    muted: boolean;
    loop: boolean;
    play: () => void;
    pause: () => void;
  };

  export function useVideoPlayer(
    source: VideoSource,
    setup?: (player: VideoPlayerHandle) => void,
  ): VideoPlayerHandle;

  export const VideoView: (props: {
    player: VideoPlayerHandle;
    style?: unknown;
    contentFit?: 'cover' | 'contain' | 'fill';
    nativeControls?: boolean;
    allowsFullscreen?: boolean;
    onError?: () => void;
  }) => any;
}
