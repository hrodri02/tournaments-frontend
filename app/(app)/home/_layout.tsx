import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{
      headerTitleAlign: 'center',
    }}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="leagues/[id]" options={{headerShown: true}}/>
    </Stack>
  );
}
