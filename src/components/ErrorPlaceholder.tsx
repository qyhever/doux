import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ErrorPlaceholderProps = {
	onRetry: () => void | Promise<void>;
};

const ErrorPlaceholder = ({ onRetry }: ErrorPlaceholderProps) => {
	return (
		<View style={styles.wrap}>
			<Text style={styles.title}>视频加载失败</Text>
			<Pressable style={styles.button} onPress={onRetry}>
				<Text style={styles.buttonText}>重试</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		backgroundColor: 'rgba(0,0,0,0.4)',
	},
	title: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	button: {
		paddingHorizontal: 18,
		paddingVertical: 9,
		borderRadius: 999,
		backgroundColor: '#ffffff',
	},
	buttonText: {
		color: '#111',
		fontSize: 13,
		fontWeight: '700',
	},
});

export default ErrorPlaceholder;
