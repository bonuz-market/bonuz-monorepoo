import { Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

export default function ScanLayout() {
  return (
    <Stack initialRouteName="scan">
      <Stack.Screen
        name="scan"
        options={{
          headerLeft: () => (
            <Pressable hitSlop={30} style={tw`p-3 rounded-full bg-[#6742c1]`}>
              <Iconify icon="ph:users-three-light" color="white" size={24} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable hitSlop={30} style={tw`p-3 rounded-full bg-[#6742c1]`}>
              <Iconify icon="ion:share-outline" color="white" size={24} />
            </Pressable>
          ),
          headerBackground: () => (
            <View style={tw.style(`bg-[#4a2ea1]`, StyleSheet.absoluteFill)} />
          ),
          title: 'Connect',
          headerTitleStyle: tw`text-white text-xl font-semibold mb-4`,
        }}
      />
    </Stack>
  );
}
