import React from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import { getVideos, VideoItem } from '../config/videos';
import { createTransitionGate, decideSwitch, normalizeIndex } from '../hooks/useVideoFeed';
import { planPreloadOps } from '../hooks/usePreloader';
import ActionButtons from './ActionButtons';
import ErrorPlaceholder from './ErrorPlaceholder';
import LoadingOverlay from './LoadingOverlay';
import ProfilePage from './ProfilePage';
import TabBar, { TabKey } from './TabBar';
import VideoInfo from './VideoInfo';
import VideoPlayer from './VideoPlayer';
import { getCardPointerEvents, getCardStepOffset, performTransition } from './videoFeed.logic';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoFeed = () => {
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [retained, setRetained] = React.useState<number[]>([]);
  const [activeTab, setActiveTab] = React.useState<TabKey>('home');
  const translateY = React.useRef(new Animated.Value(0)).current;
  const gateRef = React.useRef(createTransitionGate());

  const loadVideoList = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const nextVideos = await getVideos();
      setVideos(nextVideos);
      setCurrentIndex(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : '视频列表加载失败';
      setLoadError(message);
      setVideos([]);
      setRetained([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadVideoList();
  }, [loadVideoList]);

  React.useEffect(() => {
    if (videos.length === 0) {
      setRetained([]);
      return;
    }

    setRetained((previousRetained) => {
      const ops = planPreloadOps({
        current: currentIndex,
        length: videos.length,
        previousRetained,
        includeSecondNext: false,
      });
      return ops.acquire;
    });
  }, [currentIndex, videos.length]);

  const commitByDecision = React.useCallback((decision: 'prev' | 'next' | 'stay') => {
    if (decision === 'stay' || videos.length === 0) return;
    setCurrentIndex((index) => {
      const nextIndex = decision === 'next' ? index + 1 : index - 1;
      return normalizeIndex(nextIndex, videos.length);
    });
  }, [videos.length]);

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
      if (videos.length === 0) {
        return;
      }

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
    [animateTo, commitByDecision, translateY, videos.length],
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

  const handleTabPress = React.useCallback((tab: TabKey) => {
    if (tab === 'home' || tab === 'profile') {
      setActiveTab(tab);
    }
  }, []);

  const tabBar = <TabBar activeTab={activeTab} onTabPress={handleTabPress} />;

  if (activeTab === 'profile') {
    return (
      <SafeAreaView style={styles.screen}>
        <ProfilePage works={videos} />
        {tabBar}
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.feedbackWrap}>
          <LoadingOverlay />
        </View>
        {tabBar}
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.feedbackWrap}>
          <ErrorPlaceholder onRetry={loadVideoList} />
          <Text style={styles.feedbackText}>{loadError}</Text>
        </View>
        {tabBar}
      </SafeAreaView>
    );
  }

  if (videos.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>暂无视频</Text>
        </View>
        {tabBar}
      </SafeAreaView>
    );
  }

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
              key={`${videos[index].fileName}-${index}`}
              style={[styles.videoCard, { transform: [{ translateY: stepOffset * SCREEN_HEIGHT }] }]}
              pointerEvents={getCardPointerEvents({ currentIndex, candidateIndex: index })}
            >
              <VideoPlayer uri={videos[index].uri} isActive={index === currentIndex} />
            </View>
          );
        })}
        <View style={styles.overlayContainer} pointerEvents="box-none">
          <VideoInfo
            username="@doux_user"
            description={videos[currentIndex].videoName}
            music="原声 · doux"
          />
          <ActionButtons />
        </View>
        </Animated.View>
      </PanGestureHandler>
      {tabBar}
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
  feedbackWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  feedbackText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoFeed;
