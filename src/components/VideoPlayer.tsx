import React from 'react';
import { useEvent } from 'expo';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { VideoSource, VideoView, useVideoPlayer } from 'expo-video';
import { TapGestureHandler } from 'react-native-gesture-handler';
import ErrorPlaceholder from './ErrorPlaceholder';
import LoadingOverlay from './LoadingOverlay';
import {
  createRetryGuard,
  getDisplayState,
  getIsBufferingFromStatus,
  getVideoPointerEvents,
  resolveMuted,
  shouldPauseOnAppForeground,
  togglePlayPause,
} from './videoPlayer.logic';

export type VideoPlayerProps = {
  uri: string;
  muted?: boolean;
  isActive?: boolean;
};

const VideoPlayer = ({ uri, muted, isActive = true }: VideoPlayerProps) => {
  const [hasError, setHasError] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isUserPaused, setIsUserPaused] = React.useState(false);
  const [retryToken, setRetryToken] = React.useState(0);
  const shouldResumeAfterBufferRef = React.useRef(false);
  const appStateRef = React.useRef(AppState.currentState);
  const guardedRetry = React.useMemo(() => createRetryGuard(), []);
  const resolvedMuted = resolveMuted(muted);

  const source = React.useMemo<VideoSource>(
    () => ({ uri, metadata: { title: `video-${retryToken}` } }),
    [uri, retryToken],
  );

  const player = useVideoPlayer(source, (currentPlayer) => {
    currentPlayer.loop = true;
    currentPlayer.muted = resolvedMuted;
    if (isActive) {
      currentPlayer.play();
    } else {
      currentPlayer.pause();
    }
  });

  const statusChange = useEvent(player, 'statusChange', { status: player.status });
  const playingChange = useEvent(player, 'playingChange', { isPlaying: false });

  React.useEffect(() => {
    setIsPlaying(playingChange.isPlaying);
  }, [playingChange.isPlaying]);

  React.useEffect(() => {
    player.muted = resolvedMuted;
    if (isActive && !isUserPaused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isUserPaused, player, resolvedMuted]);

  React.useEffect(() => {
    setHasError(false);
    setIsBuffering(true);
    setIsUserPaused(false);
    shouldResumeAfterBufferRef.current = false;
  }, [uri, retryToken]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (!shouldPauseOnAppForeground(previousState, nextState)) {
        return;
      }

      shouldResumeAfterBufferRef.current = false;
      setIsUserPaused(true);
      player.pause();
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  React.useEffect(() => {
    setHasError(statusChange.status === 'error');
    setIsBuffering(getIsBufferingFromStatus(statusChange.status));

    if (statusChange.status === 'loading' && isActive && !isUserPaused) {
      shouldResumeAfterBufferRef.current = true;
    }

    // Resume only once after a loading phase, to avoid play/pause thrashing.
    if (
      statusChange.status === 'readyToPlay' &&
      isActive &&
      !isUserPaused &&
      shouldResumeAfterBufferRef.current
    ) {
      player.play();
      shouldResumeAfterBufferRef.current = false;
    }

    if (statusChange.status === 'error') {
      shouldResumeAfterBufferRef.current = false;
    }
  }, [isActive, isUserPaused, player, statusChange.status]);

  const displayState = getDisplayState({ hasError, isBuffering });

  const onRetry = React.useCallback(async () => {
    await guardedRetry(async () => {
      setRetryToken((value) => value + 1);
    });
  }, [guardedRetry]);

  const handleVideoTap = React.useCallback(() => {
    if (isPlaying) {
      shouldResumeAfterBufferRef.current = false;
    }
    setIsUserPaused(isPlaying);
    togglePlayPause(isPlaying, player);
  }, [isPlaying, player]);

  return (
    <View style={styles.container}>
      <TapGestureHandler onActivated={handleVideoTap}>
        <View style={styles.videoContainer} pointerEvents="auto">
        <VideoView
          key={`${uri}:${retryToken}`}
          style={styles.video}
          player={player}
          pointerEvents={getVideoPointerEvents()}
          contentFit="cover"
          nativeControls={false}
          fullscreenOptions={{ enable: false }}
        />
        </View>
      </TapGestureHandler>

      {displayState === 'buffering' ? <LoadingOverlay /> : null}

      {displayState === 'error' ? (
        <ErrorPlaceholder onRetry={onRetry} />
      ) : null}

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{resolvedMuted ? '静音播放' : '有声播放'}</Text>
      </View>
    </View>
  );
};

export { createRetryGuard, getDisplayState, resolveMuted, togglePlayPause };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
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
});

export default VideoPlayer;
