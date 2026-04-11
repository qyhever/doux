import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import LoadingOverlay from './LoadingOverlay';
import ErrorPlaceholder from './ErrorPlaceholder';

type Props = {
  uri: string;
  isActive: boolean;
  onError: () => void;
  onLoad: () => void;
};

export default function VideoPlayer({ uri, isActive, onError, onLoad }: Props) {
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const player = useVideoPlayer({ uri }, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  useEffect(() => {
    const statusSub = player.addListener('statusChange', (event: any) => {
      const { status, error } = event;
      if (error) {
        setHasError(true);
        setIsBuffering(false);
        onError();
      } else if (status === 'readyToPlay') {
        setIsBuffering(false);
        setHasError(false);
        onLoad();
      } else if (status === 'loading') {
        setIsBuffering(true);
      }
    });

    return () => {
      statusSub.remove();
    };
  }, [player, onError, onLoad, retryKey]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsBuffering(true);
    setRetryKey((k) => k + 1);
    player.replace({ uri });
    if (isActive) player.play();
  }, [player, uri, isActive]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
      {isBuffering && !hasError && <LoadingOverlay />}
      {hasError && <ErrorPlaceholder onRetry={handleRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});
