import { Stack } from 'expo-router';

export default function DiscoverLayout() {
  return (
    <Stack>
      <Stack.Screen name="digitalWorld" options={{ headerShown: false }} />
      <Stack.Screen name="realWorld" options={{ headerShown: false }} />
    </Stack>
  );
}
