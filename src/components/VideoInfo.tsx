import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  username?: string;
  description?: string;
  music?: string;
};

export default function VideoInfo({
  username = '@user',
  description = '这是一条视频描述 #热门 #推荐',
  music = '♪ 原声 - 热门BGM',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      <View style={styles.musicRow}>
        <Ionicons name="musical-notes" size={14} color="#fff" />
        <Text style={styles.music} numberOfLines={1}>{music}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 80,
    bottom: 120,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  music: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
  },
});
