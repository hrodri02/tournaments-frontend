import "react-native-reanimated";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot } from "expo-router";

import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import store from "@/store/store";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import '@/i18n';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  // The Slot component renders the current page or the next layout file 
  // in the routing tree (i.e., (auth)/_layout.tsx or (app)/_layout.tsx).
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
        <SafeAreaProvider>
          <ActionSheetProvider>
            <RootLayoutContent />
          </ActionSheetProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </Provider>
  );
}
