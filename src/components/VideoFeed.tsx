import React, { useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import VideoPlayer from './VideoPlayer';
import TabBar from './TabBar';
import ActionButtons from './ActionButtons';
import VideoInfo from './VideoInfo';
import { useVideoFeed } from '../hooks/useVideoFeed';
import { usePreloader } from '../hooks/usePreloader';
import { VIDEO_URLS } from '../config/videos';

const VELOCITY_THRESHOLD = 500;

export default function VideoFeed() {
  const { currentIndex, goNext, goPrev } = useVideoFeed();
  const { activeIndices } = usePreloader(currentIndex);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const translateY = useSharedValue(0);

  // Reset position after index changes (avoids flash of old content)
  useEffect(() => {
    translateY.value = 0;
  }, [currentIndex, translateY]);

  const handleVideoError = useCallback(() => {}, []);
  const handleVideoLoad = useCallback(() => {}, []);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          translateY.value = e.translationY;
        })
        .onEnd((e) => {
          const swipeThreshold = SCREEN_HEIGHT * 0.3;
          const shouldSwitch =
            Math.abs(e.translationY) > swipeThreshold ||
            Math.abs(e.velocityY) > VELOCITY_THRESHOLD;

          if (shouldSwitch && e.translationY < 0) {
            translateY.value = withSpring(-SCREEN_HEIGHT, { damping: 20, stiffness: 200 }, () => {
              runOnJS(goNext)();
            });
          } else if (shouldSwitch && e.translationY > 0) {
            translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 200 }, () => {
              runOnJS(goPrev)();
            });
          } else {
            translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
          }
        }),
    [goNext, goPrev, translateY, SCREEN_HEIGHT]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {activeIndices.map((index) => (
          <Animated.View
            key={index}
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: index === currentIndex ? 1 : 0 },
            ]}
            pointerEvents={index === currentIndex ? 'auto' : 'none'}
          >
            <VideoPlayer
              uri={VIDEO_URLS[index]}
              isActive={index === currentIndex}
              onError={handleVideoError}
              onLoad={handleVideoLoad}
            />
          </Animated.View>
        ))}
        <VideoInfo />
        <ActionButtons />
        <TabBar />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
