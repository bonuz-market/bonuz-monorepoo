/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable sonarjs/no-all-duplicated-branches */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import { View } from '@/components/Themed';


export default function Explore() {
  const { navigate } = useRouter();

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
          { paddingTop: StatusBarHeight() },
        ]}>
        <TouchableOpacity onPress={() => navigate('/cart')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/explore/leftIcon.png')} />
          </View>
        </TouchableOpacity>
        <View style={tw`py-2 flex flex-row items-center bg-[#5F42BE] w-70 h-12 rounded-full`}>
          <Image
            style={tw`w-7 h-7 mr-2 ml-2`}
            source={require('@/assets/images/home/search.png')}
          />
          <TextInput
            placeholderTextColor={'#BAB3E2'}
            placeholder="Search URL"
            style={tw`text-[16px] font-normal text-white w-80`}
          />
        </View>
        <TouchableOpacity onPress={() => navigate('/explore')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/explore/rightIcon.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
