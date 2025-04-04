import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function HomeTabLayout() {
  return (
    <Stack screenOptions={{
        headerTitleAlign: 'center'
    }}>
      <Stack.Screen name="settings" options={{title: "Settings"}}/>
      <Stack.Screen name="cities"/>
    </Stack>
  );
}