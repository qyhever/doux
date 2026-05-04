import React from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import { videos } from '../config/videos';
import { createTransitionGate, decideSwitch, normalizeIndex } from '../hooks/useVideoFeed';
import { planPreloadOps } from '../hooks/usePreloader';
import ActionButtons from './ActionButtons';
import TabBar from './TabBar';
import VideoInfo from './VideoInfo';
import VideoPlayer from './VideoPlayer';
import { getCardPointerEvents, getCardStepOffset, performTransition } from './videoFeed.logic';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [retained, setRetained] = React.useState<number[]>(() =>
    planPreloadOps({
      current: 0,
      length: videos.length,
      previousRetained: [],
      includeSecondNext: false,
    }).acquire,
  );
  const translateY = React.useRef(new Animated.Value(0)).current;
  const gateRef = React.useRef(createTransitionGate());

  React.useEffect(() => {
    setRetained((previousRetained) => {
      const ops = planPreloadOps({
        current: currentIndex,
        length: videos.length,
        previousRetained,
        includeSecondNext: false,
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
    async ({ dy, vy }: { dy: number; vy: number }) => {
      const decision = decideSwitch({
        dy,
        vy,
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

  const handlePanGestureEvent = React.useMemo(
    () =>
      Animated.event([{ nativeEvent: { translationY: translateY } }], {
        useNativeDriver: true,
      }),
    [translateY],
  );

  const handlePanStateChange = React.useCallback(
    async (event: PanGestureHandlerStateChangeEvent) => {
      const { oldState, translationY, velocityY, state } = event.nativeEvent;

      if (oldState === State.ACTIVE) {
        await handleRelease({ dy: translationY, vy: velocityY });
        return;
      }

      if (state === State.CANCELLED || state === State.FAILED) {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }).start();
      }
    },
    [handleRelease, translateY],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <PanGestureHandler
        activeOffsetY={[-6, 6]}
        failOffsetX={[-24, 24]}
        onGestureEvent={handlePanGestureEvent}
        onHandlerStateChange={handlePanStateChange}
      >
        <Animated.View style={[styles.feedCard, { transform: [{ translateY }] }]}>
        {retained.map((index) => {
          const stepOffset = getCardStepOffset({
            currentIndex,
            candidateIndex: index,
            length: videos.length,
          });

          if (stepOffset === null) {
            return null;
          }

          return (
            <View
              key={`${videos[index]}-${index}`}
              style={[styles.videoCard, { transform: [{ translateY: stepOffset * SCREEN_HEIGHT }] }]}
              pointerEvents={getCardPointerEvents({ currentIndex, candidateIndex: index })}
            >
              <VideoPlayer uri={videos[index]} isActive={index === currentIndex} />
            </View>
          );
        })}
        <View style={styles.overlayContainer} pointerEvents="box-none">
          <VideoInfo
            username="@doux_user"
            description={videos[currentIndex].split('/').pop() ?? videos[currentIndex]}
            music="原声 · doux"
          />
          <ActionButtons />
        </View>
        </Animated.View>
      </PanGestureHandler>
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
  videoCard: {
    ...StyleSheet.absoluteFillObject,
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
