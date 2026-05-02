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
            <Stack.Screen 
                name="privacy-policy/index"
                options={{
                    title: t('settings:privacy_policy.title'),
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <Stack.Screen 
                name="terms-and-conditions/index"
                options={{
                    title: t('settings:terms_and_conditions.title'),
                    headerShown: true,
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
        </Stack>
    );
}
