import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Home, MessageCircle, Plus, User, Users, LucideIcon } from 'lucide-react-native';

export type TabKey = 'home' | 'friends' | 'create' | 'messages' | 'profile';

type TabItem = {
  key: TabKey;
  label: string;
  Icon: LucideIcon;
};

type TabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

const tabs: TabItem[] = [
  { key: 'home', label: '首页', Icon: Home },
  { key: 'friends', label: '朋友', Icon: Users },
  { key: 'create', label: '发布', Icon: Plus },
  { key: 'messages', label: '消息', Icon: MessageCircle },
  { key: 'profile', label: '我的', Icon: User },
];

const TabBar = ({ activeTab, onTabPress }: TabBarProps) => {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const isCreate = tab.key === 'create';
        const color = isActive ? '#fff' : '#a8a8a8';
        const Icon = tab.Icon;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabPress(tab.key)}
            style={styles.item}
          >
            <View style={isCreate ? styles.createButton : styles.iconSlot}>
              <Icon
                color={isCreate ? '#050505' : color}
                size={isCreate ? 26 : 22}
                strokeWidth={isActive ? 2.8 : 2.2}
              />
            </View>
            <Text style={[styles.text, isActive ? styles.active : null]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: 68,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#0b0b0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconSlot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: 46,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  text: {
    color: '#a8a8a8',
    fontSize: 11,
    lineHeight: 14,
  },
  active: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default TabBar;
