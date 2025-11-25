import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{
      headerTitleAlign: 'center',
    }}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen 
        name="leagues/[id]/index" 
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
      <Stack.Screen 
        name="leagues/[id]/upcoming-league/index" 
        options={{
          title: "Upcoming League",
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
      <Stack.Screen 
        name="leagues/[id]/applications/index"
        options={{
          title: "Applications",
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
    </Stack>
  );
}
