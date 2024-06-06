import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import { Text } from '@/components/Themed';
import { useLogin } from '@/hooks/useLogin';
import { ProfileHome } from '@/pages/profile/screens';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

export default function Profile() {
  const { auth, user } = useUserStore(
    useShallow((store) => ({
      auth: store.auth,
      user: store.user,
    })),
  );

  const { login } = useLogin();

  return isNotEmpty(auth) && isNotEmpty(user) ? (
    <ProfileHome />
  ) : (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-white text-base font-medium mb-20`}>
        You are guest please login to continue
      </Text>
      <TouchableOpacity
        onPress={() => login({ provider: 'google' })}
        style={[
          tw`flex-row bg-white h-24 w-72 justify-center items-center rounded-full`,
          tw`mb-4`,
        ]}>
        <Image
          source={require('@/assets/images/google.png')}
          style={tw`w-14 h-14 mr-6`}
          resizeMode="contain"
        />
        <Text style={tw`text-black text-base font-semibold`}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => login({ provider: 'apple' })}
        style={tw`flex-row bg-white h-24 w-72 justify-center items-center rounded-full`}>
        <Image
          source={require('@/assets/images/apple.png')}
          style={tw`w-14 h-14 mr-6`}
          resizeMode="contain"
        />
        <Text style={tw`text-black text-base font-semibold`}>Sign Up with Apple</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
