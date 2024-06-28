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

import { Header } from '@/components/Header/header';
import { Wallet } from '@/entities';
import { WalletConnect } from '@/features/wallet';
import { createOrRestoreEIP155Wallet } from '@/features/wallet/utils/EIP155WalletUtil';
import { MessagesButton } from '@/pages/connections/sheets/components/messagesButton';
import { RefetchMessagesHeaderButton } from '@/pages/messages/components/refetchButton';
import { ReactQueryProvider } from '@/providers';
import { useUserStore } from '@/store';
import { setupSmartAccountSdk } from '@/store/smartAccounts';

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

  const [isSmartAccountSdkReady, setIsSmartAccountSdkReady] = React.useState(false);

  const { isHydrated, wallet } = useUserStore((store) => ({
    isHydrated: store._hasHydrated,
    wallet: store.wallet as Wallet,
  }));

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && wallet.privateKey && !isSmartAccountSdkReady) {
      setupSmartAccountSdk(wallet.privateKey)
        .then(createOrRestoreEIP155Wallet)
        .then(() => setIsSmartAccountSdkReady(true));
    }
  });

  useEffect(() => {
    if (loaded && isHydrated && isSmartAccountSdkReady) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated, isSmartAccountSdkReady, loaded, wallet.privateKey]);

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
          <Stack.Screen name="tokens" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen
            name="connection"
            options={{
              header: ({ options, navigation }) => (
                <Header
                  title={
                    <Text style={[tw`text-white text-center text-xl font-semibold`]}>
                      {options.title}
                    </Text>
                  }
                  left={
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
                  }
                  right={<MessagesButton />}
                />
              ),
              headerTransparent: true,
              title: 'Connections',
            }}
          />
          <Stack.Screen
            name="messages"
            options={{
              header: ({ options, navigation, route }) => (
                <Header
                  title={
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
                  }
                  left={
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
                  }
                  right={<RefetchMessagesHeaderButton />}
                />
              ),
              headerTransparent: true,
              title: 'Group Chat',
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              header: ({ options, navigation }) => (
                <Header
                  title={
                    <Text style={[tw`text-white text-center text-xl font-semibold`]}>
                      {options.title}
                    </Text>
                  }
                  left={
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
                  }
                />
              ),
              headerTransparent: true,
              title: 'Settings',
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(discover)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(browser)"
            options={{
              header: ({ options, navigation }) => (
                <Header
                  title={
                    <Text style={[tw`text-white text-center text-xl font-semibold`]}>
                      {options.title}
                    </Text>
                  }
                  left={
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
                  }
                />
              ),
              headerTransparent: true,
              title: 'Browser',
            }}
          />
        </Stack>
      </ReactQueryProvider>
      <Toast />
      <WalletConnect />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
