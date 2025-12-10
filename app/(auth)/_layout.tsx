// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Screens in (auth) will inherit these options */}
      <Stack.Screen name="login"/>
      <Stack.Screen name="register"/>
    </Stack>
  );
}