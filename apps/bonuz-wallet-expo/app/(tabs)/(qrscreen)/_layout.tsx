import { Stack } from 'expo-router';

export default function QrScreenLayout() {
    return (
        <Stack initialRouteName="qrScreen">
            <Stack.Screen name="qrScreen" options={{ headerShown: false }} />
        </Stack>
    );
}
