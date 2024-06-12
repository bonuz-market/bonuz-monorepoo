import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Tabs } from 'expo-router';
import React from 'react';

import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors';

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
        <Tabs.Screen name="home" />
        <Tabs.Screen name="(scan)" />
        <Tabs.Screen name="(profile)" />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
