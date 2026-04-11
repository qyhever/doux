import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import VideoPlayer from './VideoPlayer';
import TabBar from './TabBar';
import ActionButtons from './ActionButtons';
import VideoInfo from './VideoInfo';
import { useVideoFeed } from '../hooks/useVideoFeed';
import { usePreloader } from '../hooks/usePreloader';
import { VIDEO_URLS } from '../config/videos';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_HEIGHT * 0.3;
const VELOCITY_THRESHOLD = 500;

export default function VideoFeed() {
  const { currentIndex, goNext, goPrev } = useVideoFeed();
  const { activeIndices } = usePreloader(currentIndex);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const shouldSwitch =
        Math.abs(e.translationY) > SWIPE_THRESHOLD ||
        Math.abs(e.velocityY) > VELOCITY_THRESHOLD;

      if (shouldSwitch && e.translationY < 0) {
        translateY.value = withTiming(-SCREEN_HEIGHT, { duration: 300 }, () => {
          translateY.value = 0;
          runOnJS(goNext)();
        });
      } else if (shouldSwitch && e.translationY > 0) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, () => {
          translateY.value = 0;
          runOnJS(goPrev)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Preloaded videos rendered off-screen */}
        {activeIndices
          .filter((i) => i !== currentIndex)
          .map((index) => (
            <View key={index} style={styles.offscreen}>
              <VideoPlayer
                uri={VIDEO_URLS[index]}
                isActive={false}
                onError={() => {}}
                onLoad={() => {}}
              />
            </View>
          ))}

        {/* Active video */}
        <VideoPlayer
          uri={VIDEO_URLS[currentIndex]}
          isActive={true}
          onError={() => {}}
          onLoad={() => {}}
        />

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
  offscreen: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 0,
  },
});
