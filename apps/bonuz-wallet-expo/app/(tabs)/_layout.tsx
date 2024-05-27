import { Tabs } from 'expo-router';
import React from 'react';

import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(properties) => <TabBar {...properties} />}
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
        name="profile"

        // options={{
        //   title: 'Tab Two',
        //   tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        // }}
      />
    </Tabs>
  );
}