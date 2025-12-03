import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

export default function SettingsTabLayout() {
    const { t } = useTranslation(['common', 'settings']);

    return (
        <Stack screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="index" options={{title: t('settings_label')}}/>
            <Stack.Screen 
                name="language-preference/index"
                options={{
                    title: t('settings:language_preference.title'),
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
        </Stack>
    );
}
