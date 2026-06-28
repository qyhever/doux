import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TabKey = 'home' | 'friends' | 'create' | 'messages' | 'profile';

type TabItem = {
	key: TabKey;
	label: string;
};

type TabBarProps = {
	activeTab: TabKey;
	onTabPress: (tab: TabKey) => void;
};

const tabs: TabItem[] = [
	{ key: 'home', label: '首页' },
	{ key: 'friends', label: '朋友' },
	{ key: 'create', label: '+' },
	{ key: 'messages', label: '消息' },
	{ key: 'profile', label: '我的' },
];

const TabBar = ({ activeTab, onTabPress }: TabBarProps) => {
	return (
		<View style={styles.wrap}>
			{tabs.map((tab) => (
				<Pressable
					key={tab.key}
					accessibilityRole="tab"
					accessibilityState={{ selected: tab.key === activeTab }}
					onPress={() => onTabPress(tab.key)}
					style={styles.item}
				>
					<Text style={[styles.text, tab.key === activeTab ? styles.active : null]}>{tab.label}</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		height: 64,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: '#333',
		backgroundColor: '#101010',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	item: {
		flex: 1,
		alignItems: 'center',
	},
	text: {
		color: '#a3a3a3',
		fontSize: 13,
	},
	active: {
		color: '#fff',
		fontWeight: '700',
	},
});

export default TabBar;
