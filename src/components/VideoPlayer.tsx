import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { VideoSource, VideoView, useVideoPlayer } from 'expo-video';
import ErrorPlaceholder from './ErrorPlaceholder';
import LoadingOverlay from './LoadingOverlay';
import { createRetryGuard, getDisplayState } from './videoPlayer.logic';

export type VideoPlayerProps = {
  uri: string;
  muted?: boolean;
  isActive?: boolean;
};

const VideoPlayer = ({ uri, muted = true, isActive = true }: VideoPlayerProps) => {
  const [hasError, setHasError] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(true);
  const [retryToken, setRetryToken] = React.useState(0);
  const guardedRetry = React.useMemo(() => createRetryGuard(), []);

  const source = React.useMemo<VideoSource>(
    () => ({ uri, metadata: { title: `video-${retryToken}` } }),
    [uri, retryToken],
  );

  const player = useVideoPlayer(source, (currentPlayer) => {
    currentPlayer.loop = true;
    currentPlayer.muted = muted;
    if (isActive) {
      currentPlayer.play();
    } else {
      currentPlayer.pause();
    }
  });

  React.useEffect(() => {
    player.muted = muted;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, muted, player]);

  React.useEffect(() => {
    setHasError(false);
    setIsBuffering(true);
    const timer = setTimeout(() => {
      setIsBuffering(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [uri, retryToken]);

  const displayState = getDisplayState({ hasError, isBuffering });

  const onRetry = React.useCallback(async () => {
    await guardedRetry(async () => {
      setRetryToken((value) => value + 1);
    });
  }, [guardedRetry]);

  return (
    <View style={styles.container}>
      <VideoView
        key={`${uri}:${retryToken}`}
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
      />

      {displayState === 'buffering' ? <LoadingOverlay /> : null}

      {displayState === 'error' ? (
        <ErrorPlaceholder onRetry={onRetry} />
      ) : null}

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{muted ? '静音播放' : '有声播放'}</Text>
      </View>

      <Pressable style={styles.tapZone} onPress={() => setIsBuffering(false)}>
        <Text style={styles.tapHint}>轻触隐藏缓冲层</Text>
      </Pressable>
    </View>
  );
};

export { createRetryGuard, getDisplayState };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: 24,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.52)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  tapZone: {
    position: 'absolute',
    left: 10,
    top: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tapHint: {
    color: '#c8c8c8',
    fontSize: 11,
  },
});

export default VideoPlayer;
