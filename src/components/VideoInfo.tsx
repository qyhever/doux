import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type VideoInfoProps = {
	username: string;
	description: string;
	music: string;
};

const VideoInfo = ({ username, description, music }: VideoInfoProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.username}>{username}</Text>
			<Text style={styles.description}>{description}</Text>
			<Text style={styles.music}>♪ {music}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingRight: 16,
		gap: 6,
	},
	username: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 16,
	},
	description: {
		color: '#f0f0f0',
		fontSize: 13,
		lineHeight: 18,
	},
	music: {
		color: '#ddd',
		fontSize: 12,
	},
});

export default VideoInfo;
