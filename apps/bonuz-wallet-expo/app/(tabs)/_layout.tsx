import { Tabs } from 'expo-router';
import React from 'react';

import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors';
import { useUiStore } from '@/store/ui';

export default function TabLayout() {
  const isTabBarHidden = useUiStore((state) => state.isTabBarHidden);
  console.log('isTabBarHidden', isTabBarHidden);

  return (
    <Tabs
      tabBar={(properties) => {
        return isTabBarHidden ? undefined : <TabBar {...properties} />;
      }}
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        // options={{
        //   title: 'Tab One',
        //   tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        // }}
      />
      <Tabs.Screen
        name="(profile)"

        // options={{
        //   title: 'Tab Two',
        //   tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        // }}
      />
    </Tabs>
  );
}
