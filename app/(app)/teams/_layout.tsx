import { Stack, useRouter } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; 
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function TeamsTabLayout() {
    const router = useRouter(); 
    const { t } = useTranslation('teams');

    return (
        <Stack screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen 
                name="index" 
                options={{
                    title: t('teams:title'),
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
                    title: t('detail.invites_option'),
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <Stack.Screen 
                name="[id]/join-league/index"
                options={{
                    title: t('detail.join_league_option'),
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <Stack.Screen name="create-team/index" options={{title: t('create_team.title')}}/>
            <Stack.Screen 
                name="[id]/upload-team-logo/index" 
                options={{
                    title: t('upload_team_logo.title'),
                    headerLeft: () => null
                }}
            />
        </Stack>
    );
}
