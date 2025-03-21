import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function HomeTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="leagues/[id]" options={{headerTitleAlign: 'center'}}/>
    </Stack>
  );
}
