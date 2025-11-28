import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function HomeTabLayout() {
    return (
        <Stack screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="index" options={{title: "Settings"}}/>
            <Stack.Screen 
                name="language-preference/index"
                options={{
                    title: "Language Preference",
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
        </Stack>
    );
}
