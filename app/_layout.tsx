import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const Layout = () => {
	return (
		<>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#000' },
				}}
			/>
		</>
	);
};

export default Layout;
