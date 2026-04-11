import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';
import VideoFeed from '../src/components/VideoFeed';

export default function FeedPage() {
  useEffect(() => {
    // Allow audio to play even when iOS silent mode is on
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
    }).catch(() => {
      // Non-critical: ignore if fails
    });
  }, []);

  return (
    <View style={styles.container}>
      <VideoFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
