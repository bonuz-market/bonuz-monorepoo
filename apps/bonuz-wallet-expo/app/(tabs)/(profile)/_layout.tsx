import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack initialRouteName="profile">
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
