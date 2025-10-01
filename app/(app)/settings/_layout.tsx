import {Stack} from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function HomeTabLayout() {
    return (
        <Stack screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="index" options={{title: "Settings"}}/>
            <Stack.Screen name="create-team/index" options={{title: "Create Team"}}/>
        </Stack>
    );
}
