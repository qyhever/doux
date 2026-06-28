import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import VideoPlayer from '../src/components/VideoPlayer';

const firstParam = (value: string | string[] | undefined): string | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

const VideoDetail = () => {
  const params = useLocalSearchParams<{
    uri?: string | string[];
    videoName?: string | string[];
    fileName?: string | string[];
  }>();
  const uri = firstParam(params.uri);
  const videoName = firstParam(params.videoName);
  const fileName = firstParam(params.fileName);

  const handleBack = React.useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {uri ? (
        <VideoPlayer uri={uri} isActive />
      ) : (
        <View style={styles.errorState}>
          <Text style={styles.errorTitle}>视频参数缺失</Text>
          <Text style={styles.errorText}>无法打开当前作品，请返回后重试。</Text>
        </View>
      )}

      <View style={styles.topOverlay} pointerEvents="box-none">
        <Pressable style={styles.backButton} onPress={handleBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.infoOverlay} pointerEvents="none">
        <Text style={styles.username}>@doux_user</Text>
        <Text style={styles.videoName} numberOfLines={2}>
          {videoName ?? fileName ?? '未命名作品'}
        </Text>
        <Text style={styles.music}>♪ 原声 · doux</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  topOverlay: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  infoOverlay: {
    position: 'absolute',
    left: 16,
    right: 88,
    bottom: 34,
    gap: 6,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  videoName: {
    color: '#f0f0f0',
    fontSize: 13,
    lineHeight: 18,
  },
  music: {
    color: '#ddd',
    fontSize: 12,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  errorText: {
    marginTop: 10,
    color: '#cfcfcf',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default VideoDetail;
