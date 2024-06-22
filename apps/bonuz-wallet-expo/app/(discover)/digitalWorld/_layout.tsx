import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

export default function DiscoverLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[category]"
        options={{
          header: ({ options, navigation }) => (
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
          headerBackground: () => (
            <View style={tw.style(`bg-[#553eb4]`, StyleSheet.absoluteFill)} />
          ),
          title: 'Digital World',
        }}
        getId={({ params }) => String(Date.now())}
      />
    </Stack>
  );
}
