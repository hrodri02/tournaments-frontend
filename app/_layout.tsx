import "react-native-reanimated";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot } from "expo-router";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isLoading } = useAuth();

  // If you also want to redirect unauthenticated users away from the main app structure,
  // this is the place to put a <Redirect href="/sign-in" /> component.

  if (isLoading) {
    // Show a loading indicator while the SecureStore data is being read
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  // Once loading is false, render the rest of the application
  return <Slot />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <ActionSheetProvider>
          <RootLayoutContent />
        </ActionSheetProvider>
      </AuthProvider>
    </Provider>
  );
}
