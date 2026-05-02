import { Tabs, Slot, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from 'react-native';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const { t } = useTranslation('common');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while the SecureStore data is being read
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  else if (!user) {
    return <Redirect href="/login" />
  }

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
