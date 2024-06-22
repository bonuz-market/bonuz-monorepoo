import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

export default function DiscoverLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation, route }) => (
          <LinearGradient colors={['#0E2875', '#4B2EA2']} start={[0, 0]} end={[1, 1]}>
            <View style={tw`rounded-b-[30px] pb-4 px-4  bg-[#553eb4]`}>
              <View style={tw`flex-row items-center bg-transparent`}>
                <View style={tw`h-[48px] w-[48px] z-50`}>
                  <Pressable
                    onPress={navigation.goBack}
                    hitSlop={30}
                    style={tw`p-3 absolute rounded-full bg-[#6742c1] `}>
                    <Iconify icon="ion:chevron-back-outline" color="white" size={24} />
                  </Pressable>
                </View>
                <Text
                  style={[
                    tw`text-white text-center flex-1 text-xl font-semibold`,
                    { transform: [{ translateX: -24 }] },
                  ]}>
                  {options.title}
                </Text>
              </View>
            </View>
          </LinearGradient>
        ),
        headerBackground: () => <View style={tw.style(`bg-[#553eb4]`, StyleSheet.absoluteFill)} />,
        title: 'Real World',
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[category]" getId={({ params }) => String(Date.now())} />
      <Stack.Screen
        name="partner/[slug]"
        getId={({ params }) => String(Date.now())}
        // @ts-ignore
        options={({ navigation, route }) => ({
          headerBackground: () => (
            <View style={tw.style(`bg-transparent`, StyleSheet.absoluteFill)} />
          ),
          headerTransparent: true,
          header: undefined,
          title: '',
          headerLeft: ({ canGoBack }) =>
            canGoBack && (
              <BlurView
                style={tw`rounded-full overflow-hidden items-center justify-center`}
                intensity={50}
                tint="light">
                <Pressable onPress={navigation.goBack} hitSlop={30} style={tw`p-3 bg-transparent`}>
                  <Iconify icon="ion:chevron-back-outline" color="white" size={30} />
                </Pressable>
              </BlurView>
            ),
          headerRight: () => {
            const handleShare = async () => {
              // TODO: add Universal link to handle share
              await Sharing.shareAsync(`https://app.bonuz.id/partner/${route.params.slug}`);
            };

            return (
              <BlurView
                style={tw`rounded-full overflow-hidden items-center justify-center`}
                intensity={50}
                tint="light">
                <Pressable onPress={handleShare} hitSlop={30} style={tw`p-3 rounded-full`}>
                  <Iconify icon="ion:share-outline" color="white" size={30} />
                </Pressable>
              </BlurView>
            );
          },
        })}
      />
    </Stack>
  );
}
