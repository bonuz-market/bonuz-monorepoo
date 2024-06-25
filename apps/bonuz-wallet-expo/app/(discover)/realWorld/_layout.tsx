import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

import { Header } from '@/components/Header/header';
import { ShareButton } from '@/pages/discovery/components/shareButton';

export default function DiscoverLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation }) => (
          <Header
            title={
              <Text style={tw`text-white text-center text-xl font-semibold`}>{options.title}</Text>
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
        title: 'Real World',
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[category]" getId={({ params }) => String(Date.now())} />
      <Stack.Screen
        name="partner/[slug]"
        getId={({ params }) => String(Date.now())}
        // @ts-ignore
        options={({ navigation, route }) => ({
          headerTransparent: true,
          header: () => (
            <Header
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
              right={<ShareButton route={route} />}
            />
          ),
        })}
      />
    </Stack>
  );
}
