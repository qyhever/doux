import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ActionItem = {
  icon: keyof typeof Ionicons.glyphMap;
  count: string;
};

const ACTIONS: ActionItem[] = [
  { icon: 'heart', count: '23.4万' },
  { icon: 'chatbubble-ellipses', count: '1823' },
  { icon: 'bookmark', count: '4502' },
  { icon: 'arrow-redo', count: '分享' },
];

export default function ActionButtons() {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar} />
        <View style={styles.followDot}>
          <Text style={styles.followDotText}>+</Text>
        </View>
      </View>

      {/* Action buttons */}
      {ACTIONS.map((action) => (
        <View key={action.icon} style={styles.actionItem}>
          <Ionicons name={action.icon} size={32} color="#fff" />
          <Text style={styles.count}>{action.count}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#666',
    borderWidth: 2,
    borderColor: '#fff',
  },
  followDot: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#fe2c55',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followDotText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
