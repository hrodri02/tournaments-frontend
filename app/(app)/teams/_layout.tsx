import { Stack, useRouter } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; 
import { Pressable } from 'react-native';

export default function TeamsTabLayout() {
    const router = useRouter(); 

    return (
        <Stack screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen 
                name="index" 
                options={{
                    title: "Teams",
                    headerRight: () => (
                        <Pressable onPress={() => {router.push('/teams/create-team');}}>
                            <Ionicons name="add" size={24} color="black" style={{ marginRight: 15 }} />
                        </Pressable>
                    )
                }}
            />
            <Stack.Screen 
                name="[id]/index"
                options={{
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <Stack.Screen 
                name="[id]/invites/index"
                options={{
                    title: "Invites",
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <Stack.Screen 
                name="[id]/join-league/index"
                options={{
                    title: "Join League",
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <Stack.Screen name="create-team/index" options={{title: "Create Team"}}/>
        </Stack>
    );
}
