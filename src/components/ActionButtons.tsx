import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ActionButtons = () => {
	return (
		<View style={styles.container}>
			<View style={styles.avatar} />
			<ActionStat label="赞" value="1.2w" />
			<ActionStat label="评" value="326" />
			<ActionStat label="藏" value="88" />
			<ActionStat label="享" value="71" />
		</View>
	);
};

const ActionStat = ({ label, value }: { label: string; value: string }) => {
	return (
		<View style={styles.item}>
			<View style={styles.circle}>
				<Text style={styles.label}>{label}</Text>
			</View>
			<Text style={styles.value}>{value}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 62,
		alignItems: 'center',
		gap: 14,
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 2,
		borderColor: '#fff',
		backgroundColor: '#252525',
	},
	item: {
		alignItems: 'center',
		gap: 6,
	},
	circle: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: 'rgba(0,0,0,0.42)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '700',
	},
	value: {
		color: '#ececec',
		fontSize: 12,
	},
});

export default ActionButtons;
