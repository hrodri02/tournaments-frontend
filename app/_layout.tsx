import "react-native-reanimated";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Slot } from "expo-router";

import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import store from "@/store/store";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    <AuthProvider>
      <Provider store={store}>
        <Slot />
      </Provider>
    </AuthProvider>
  );
}
