import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

type Props = {
  onRetry: () => void;
};

export default function ErrorPlaceholder({ onRetry }: Props) {
  return (
    <View style={styles.container}>
      {/* Placeholder image representing a broken video */}
      <View style={styles.imagePlaceholder}>
        <View style={styles.playIconOuter}>
          <View style={styles.playIconInner} />
        </View>
        <View style={styles.brokenLine} />
      </View>
      <Text style={styles.message}>视频加载失败</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>重试</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 80,
    backgroundColor: '#222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconInner: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#666',
    marginLeft: 3,
  },
  brokenLine: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: '#333',
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#fe2c55',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
