import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingOverlay = () => {
	return (
		<View style={styles.wrap}>
			<ActivityIndicator size="large" color="#ffffff" />
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
		backgroundColor: 'rgba(0,0,0,0.18)',
	},
});

export default LoadingOverlay;
