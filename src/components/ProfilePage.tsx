import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { VideoItem } from '../config/videos';

const stats = [
  { label: '获赞', value: '12.8w' },
  { label: '关注', value: '128' },
  { label: '粉丝', value: '3.6w' },
];

const quickActions = ['编辑资料', '作品管理', '我的收藏'];

type ProfilePageProps = {
  works: VideoItem[];
};

const ProfilePage = ({ works }: ProfilePageProps) => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>D</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>doux_user</Text>
          <Text style={styles.handle}>抖音号: doux_2026</Text>
          <Text style={styles.bio}>记录一点日常，也收集一些灵感。</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statItem}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        {quickActions.map((action, index) => (
          <View key={action} style={[styles.actionButton, index === 0 ? styles.primaryAction : null]}>
            <Text style={[styles.actionText, index === 0 ? styles.primaryActionText : null]}>{action}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tabRow}>
        <Text style={[styles.profileTab, styles.profileTabActive]}>作品</Text>
        <Text style={styles.profileTab}>喜欢</Text>
        <Text style={styles.profileTab}>私密</Text>
      </View>

      <View style={styles.grid}>
        {works.map((item) => (
          <View key={`${item.fileName}-${item.videoName}`} style={styles.workCard}>
            <View style={styles.workMedia}>
              {item.cover ? (
                <Image source={{ uri: item.cover }} style={styles.workCover} resizeMode="cover" />
              ) : (
                <View style={styles.workCoverFallback} />
              )}
              <View style={styles.workTitleScrim}>
                <Text style={styles.workTitle} numberOfLines={1}>
                  {item.videoName}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f0e8',
    borderWidth: 3,
    borderColor: '#292929',
  },
  avatarText: {
    color: '#111',
    fontSize: 38,
    fontWeight: '800',
  },
  identity: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  handle: {
    marginTop: 6,
    color: '#8f8f8f',
    fontSize: 13,
  },
  bio: {
    marginTop: 10,
    color: '#d8d8d8',
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    marginTop: 28,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#292929',
    paddingVertical: 18,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 4,
    color: '#8c8c8c',
    fontSize: 12,
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#242424',
  },
  primaryAction: {
    backgroundColor: '#f6f6f6',
  },
  actionText: {
    color: '#f2f2f2',
    fontSize: 13,
    fontWeight: '700',
  },
  primaryActionText: {
    color: '#111',
  },
  tabRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#292929',
  },
  profileTab: {
    marginRight: 28,
    paddingBottom: 12,
    color: '#8f8f8f',
    fontSize: 15,
    fontWeight: '700',
  },
  profileTabActive: {
    color: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  grid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  workCard: {
    width: '33.333%',
    aspectRatio: 0.74,
    padding: 3,
  },
  workMedia: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#202020',
  },
  workCover: {
    flex: 1,
    backgroundColor: '#202020',
  },
  workCoverFallback: {
    flex: 1,
    backgroundColor: '#202020',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
  },
  workTitleScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 34,
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  workTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProfilePage;
