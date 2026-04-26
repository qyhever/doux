import React from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  PanResponderGestureState,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { videos } from '../config/videos';
import { createTransitionGate, decideSwitch, normalizeIndex } from '../hooks/useVideoFeed';
import { planPreloadOps } from '../hooks/usePreloader';
import ActionButtons from './ActionButtons';
import TabBar from './TabBar';
import VideoInfo from './VideoInfo';
import VideoPlayer from './VideoPlayer';
import { performTransition } from './videoFeed.logic';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [retained, setRetained] = React.useState<number[]>([0, 1]);
  const translateY = React.useRef(new Animated.Value(0)).current;
  const gateRef = React.useRef(createTransitionGate());

  React.useEffect(() => {
    setRetained((previousRetained) => {
      const ops = planPreloadOps({
        current: currentIndex,
        length: videos.length,
        previousRetained,
      });
      return ops.acquire;
    });
  }, [currentIndex]);

  const commitByDecision = React.useCallback((decision: 'prev' | 'next' | 'stay') => {
    if (decision === 'stay') return;
    setCurrentIndex((index) => {
      const nextIndex = decision === 'next' ? index + 1 : index - 1;
      return normalizeIndex(nextIndex, videos.length);
    });
  }, []);

  const animateTo = React.useCallback((toValue: number) => {
    return new Promise<void>((resolve) => {
      Animated.timing(translateY, {
        toValue,
        duration: 180,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  }, [translateY]);

  const handleRelease = React.useCallback(
    async (_: unknown, gestureState: PanResponderGestureState) => {
      const decision = decideSwitch({
        dy: gestureState.dy,
        vy: gestureState.vy,
        height: SCREEN_HEIGHT,
      });

      if (!gateRef.current.tryLock()) {
        return;
      }

      try {
        const target = decision === 'next' ? -SCREEN_HEIGHT : decision === 'prev' ? SCREEN_HEIGHT : 0;
        await performTransition({
          animate: () => animateTo(target),
          commit: () => commitByDecision(decision),
        });
      } finally {
        translateY.setValue(0);
        gateRef.current.release();
      }
    },
    [animateTo, commitByDecision, translateY],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_: unknown, gestureState: PanResponderGestureState) =>
          Math.abs(gestureState.dy) > 6,
        onPanResponderMove: (_: unknown, gestureState: PanResponderGestureState) => {
          translateY.setValue(gestureState.dy);
        },
        onPanResponderRelease: handleRelease,
        onPanResponderTerminate: () => {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }).start();
        },
      }),
    [handleRelease, translateY],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.feedCard, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
        <VideoPlayer uri={videos[currentIndex]} isActive muted />
        <View style={styles.overlayContainer}>
          <VideoInfo
            username="@doux_user"
            description="稳定性优先的短视频体验"
            music="原声 · doux"
          />
          <ActionButtons />
        </View>
      </Animated.View>
      <TabBar />
    </SafeAreaView>
  );
};

export { performTransition };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  feedCard: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
});

export default VideoFeed;
