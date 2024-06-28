import { Stack } from 'expo-router';

export default function BrowserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="browser" options={{ headerShown: false }} />
    </Stack>
  );
}
