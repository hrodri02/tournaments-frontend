import { Stack, Redirect } from "expo-router";

export default function AppLayout() {
    const status = 'signOut';
    if (status === 'signOut') {
      return <Redirect href="/auth/login" />;
    }
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}