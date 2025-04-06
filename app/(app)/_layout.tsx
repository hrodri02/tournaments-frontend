import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppLayout() {

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
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
