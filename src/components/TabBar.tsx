import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const TABS: TabItem[] = [
  { key: 'home', label: '首页', icon: 'home' },
  { key: 'friends', label: '朋友', icon: 'people' },
  { key: 'plus', label: '', icon: 'add' },
  { key: 'messages', label: '消息', icon: 'chatbubble' },
  { key: 'profile', label: '我', icon: 'person' },
];

export default function TabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const isPlus = tab.key === 'plus';
        return (
          <TouchableOpacity key={tab.key} style={styles.tab} activeOpacity={1}>
            {isPlus ? (
              <View style={styles.plusButton}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            ) : (
              <>
                <Ionicons name={tab.icon} size={24} color="#fff" />
                <Text style={styles.label}>{tab.label}</Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    color: '#fff',
    fontSize: 10,
  },
  plusButton: {
    backgroundColor: '#fe2c55',
    borderRadius: 8,
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
