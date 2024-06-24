import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';

import { RefetchMessagesHeaderButton } from '@/pages/messages/components/refetchButton';
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
  const { top } = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={styles.container}>
      <ReactQueryProvider>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="wallet" options={{ headerShown: false }} />
          <Stack.Screen name="nfts" options={{ headerShown: false }} />
          <Stack.Screen name="tokens" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="connection" options={{ headerShown: false }} />
          <Stack.Screen
            name="messages"
            options={{
              header: ({ options, navigation, route }) => (
                <BlurView
                  style={[
                    tw`flex-1 w-full pb-4 px-4 rounded-b-[30px] overflow-hidden`,
                    { paddingTop: top },
                  ]}
                  intensity={50}
                  tint="light">
                  <View
                    style={tw`flex-row flex-1 h-full items-center bg-transparent justify-center`}>
                    <View style={tw`h-[48px] w-[48px] z-50`}>
                      <Pressable onPress={navigation.goBack} hitSlop={30} style={tw`absolute`}>
                        <BlurView
                          style={[tw`flex-1 p-3 rounded-full overflow-hidden`]}
                          intensity={50}
                          tint="light">
                          <Iconify icon="ion:chevron-back-outline" color="white" size={24} />
                        </BlurView>
                      </Pressable>
                    </View>
                    <View style={tw`flex-1 flex-col gap-2`}>
                      <Text style={[tw`text-white text-center flex-1 text-xl font-semibold`]}>
                        {options.title}
                      </Text>
                      <Text style={[tw`text-white text-opacity-70 text-center flex-1 text-sm`]}>
                        {(
                          route.params as {
                            members: string;
                          }
                        ).members ?? ''}{' '}
                        Members
                      </Text>
                    </View>
                    <RefetchMessagesHeaderButton />
                  </View>
                </BlurView>
              ),
              headerTransparent: true,
              title: 'Group Chat',
            }}
          />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(discover)" options={{ headerShown: false }} />
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
