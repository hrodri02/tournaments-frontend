import { Stack, useRouter } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; 
import { Pressable } from 'react-native';

export default function HomeTabLayout() {
    const router = useRouter(); 

    return (
        <Stack screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="index" options={{title: "Settings"}}/>
            <Stack.Screen 
                name="teams/index" 
                options={{
                    title: "Teams",
                    headerRight: () => (
                        <Pressable onPress={() => {router.push('/settings/teams/create-team');}}>
                            <Ionicons name="add" size={24} color="black" style={{ marginRight: 15 }} />
                        </Pressable>
                    )
                }}
            />
            <Stack.Screen name="teams/create-team/index" options={{title: "Create Team"}}/>
        </Stack>
    );
}
