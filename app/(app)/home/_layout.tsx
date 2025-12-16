import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';

export default function HomeLayout() {
  const { t } = useTranslation('home');

  return (
    <Stack screenOptions={{
      headerTitleAlign: 'center',
    }}>
      <Stack.Screen 
        name="index" 
        options={{
          title: t('title'),
        }}
      />
      <Stack.Screen 
        name="create-league/index" 
        options={{
          title: t('create_league.title'),
        }}
      />
      <Stack.Screen 
        name="leagues/[id]/index" 
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
      <Stack.Screen 
        name="leagues/[id]/upcoming-league/index" 
        options={{
          title: "Upcoming League",
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
      <Stack.Screen 
        name="leagues/[id]/applications/index"
        options={{
          title: t('upcoming_league.applications_label'),
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
    </Stack>
  );
}
