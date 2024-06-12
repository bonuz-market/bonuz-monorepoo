import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack initialRouteName="scan">
      <Stack.Screen name="scan" options={{ headerShown: false }} />
    </Stack>
  );
}
