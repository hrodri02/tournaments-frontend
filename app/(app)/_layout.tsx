import { Stack, Redirect } from "expo-router";
import { selectAuthUser } from '@/store/auth.slice';
import { useAppSelector } from '@/hooks/useStore';

export default function AppLayout() {
    const authUser =  useAppSelector(selectAuthUser);
    if (authUser === null) {
      return <Redirect href="/auth/login" />;
    }
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}