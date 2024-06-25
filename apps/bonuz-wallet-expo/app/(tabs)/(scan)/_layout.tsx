import { BlurView } from 'expo-blur';
import { Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

import { Header } from '@/components/Header/header';

export default function ScanLayout() {
  return (
    <Stack initialRouteName="scan">
      <Stack.Screen
        name="scan"
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
                      <Iconify icon="ph:users-three-light" color="white" size={24} />
                    </BlurView>
                  </Pressable>
                </View>
              }
              right={
                <View style={tw`h-[48px] w-[48px] z-50`}>
                  <Pressable onPress={navigation.goBack} hitSlop={30} style={tw`absolute`}>
                    <BlurView
                      style={[tw`flex-1 p-3 rounded-full overflow-hidden`]}
                      intensity={50}
                      tint="light">
                      <Iconify icon="ion:share-outline" color="white" size={24} />
                    </BlurView>
                  </Pressable>
                </View>
              }
            />
          ),
          headerTransparent: true,

          title: 'Connect',
        }}
      />
    </Stack>
  );
}
