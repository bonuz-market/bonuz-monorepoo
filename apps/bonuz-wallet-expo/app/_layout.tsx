import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { ReactQueryProvider } from '@/providers';
import { useUserStore } from '@/store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isHydrated } = useUserStore((store) => ({
    isHydrated: store._hasHydrated,
  }));

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated, loaded]);

  if (!loaded || !isHydrated) {
    return;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ReactQueryProvider>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="wallet" options={{ headerShown: false }} />
          <Stack.Screen name="nfts" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="connection" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ReactQueryProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
