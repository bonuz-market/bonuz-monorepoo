import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

import { Header } from '@/components/Header/header';
import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors';
import { MessagesButton } from '@/pages/connections/sheets/components/messagesButton';

export default function TabLayout() {
  return (
    <BottomSheetModalProvider>
      <Tabs
        tabBar={(properties) => {
          return <TabBar {...properties} />;
        }}
        screenOptions={{
          tabBarActiveTintColor: Colors['light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: false,
        }}>
        <Tabs.Screen
          name="home"
          options={{
            headerShown: true,
            header: () => (
              <Header
                title={
                  <Image
                    style={tw`w-33 h-9 self-center`}
                    source={require('@/assets/images/home/logo.png')}
                  />
                }
                left={
                  <View style={tw`h-[48px] w-[48px] z-50`}>
                    <Link href="/connection" asChild>
                      <Pressable hitSlop={30} style={tw`absolute`}>
                        <BlurView
                          style={[tw`flex-1 p-3 rounded-full overflow-hidden`]}
                          intensity={50}
                          tint="light">
                          <Iconify icon="ph:users-three-light" color="white" size={24} />
                        </BlurView>
                      </Pressable>
                    </Link>
                  </View>
                }
                right={
                  <View style={tw`h-[48px] w-[48px] z-50`}>
                    <Link href="/wallet" asChild>
                      <Pressable hitSlop={30} style={tw`absolute`}>
                        <BlurView
                          style={[tw`flex-1 p-3 rounded-full overflow-hidden`]}
                          intensity={50}
                          tint="light">
                          <Iconify icon="ion:wallet-outline" color="white" size={24} />
                        </BlurView>
                      </Pressable>
                    </Link>
                  </View>
                }
              />
            ),
            headerTransparent: true,
          }}
        />
        <Tabs.Screen name="(scan)" />
        <Tabs.Screen name="(profile)" />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
