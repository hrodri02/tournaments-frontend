import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTranslation } from "react-i18next";

export default function AppLayout() {
  const { t } = useTranslation('common');

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* This is needed to hide the index tab */}
        <Tabs.Screen name="index" redirect />
        <Tabs.Screen
          name="home"
          options={{
            title: t('home_label'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: t('teams_label'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('settings_label'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
