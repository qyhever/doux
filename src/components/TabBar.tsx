import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const tabs = ['首页', '朋友', '+', '消息', '我'];

const TabBar = () => {
	return (
		<View style={styles.wrap}>
			{tabs.map((tab, index) => (
				<View key={tab} style={styles.item}>
					<Text style={[styles.text, index === 0 ? styles.active : null]}>{tab}</Text>
				</View>
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
