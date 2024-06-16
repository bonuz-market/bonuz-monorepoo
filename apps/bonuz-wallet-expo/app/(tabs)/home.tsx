import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import HomeCarousel from '@/components/HomeCarousel';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import { Text, View } from '@/components/Themed';
import { useBottomTabBarMargin } from '@/hooks/useBottomTabBarHeight';

export default function Home() {
  const [yourItemIndex, setYourItemIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const tabBarMargin = useBottomTabBarMargin();
  const { navigate } = useRouter();

  let yourItemsArray = [0, 1, 2];
  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
          { paddingTop: StatusBarHeight() },
        ]}>
        <TouchableOpacity onPress={() => navigate('/connection')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <View
              style={tw`bg-[#FF3B30] absolute top-[-1] left-9 w-[20px] rounded-full justify-center items-center`}>
              <Text style={tw`text-[12px] text-white font-semibold`}>7</Text>
            </View>
            <Image
              style={tw`w-[30px] h-[30px]`}
              source={require('@/assets/images/home/profile.png')}
            />
          </View>
        </TouchableOpacity>
        <Image style={tw`w-33 h-9`} source={require('@/assets/images/home/logo.png')} />
        <TouchableOpacity onPress={() => navigate('/cart')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image
              style={tw`w-[30px] h-[30px]`}
              source={require('@/assets/images/home/cart.png')}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={tw`flex flex-row items-center bg-transparent mx-5 py-5 justify-between`}>
        <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
          <Image
            style={tw`w-[30px] h-[30px]`}
            source={require('@/assets/images/home/filter.png')}
          />
        </View>
        <View
          style={tw`py-2 flex flex-row items-center bg-[#5F42BE] w-83 h-12 rounded-full border-2 border-[#7651CD]`}>
          <Image style={tw`w-7 h-7 mr-2`} source={require('@/assets/images/home/search.png')} />
          <TextInput
            placeholderTextColor={'#BAB3E2'}
            placeholder="Search events, shops, communities..."
            style={tw`text-[16px] font-normal text-white w-80`}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: tabBarMargin }} style={tw`flex-1`}>
        <HomeCarousel
          title={'Events'}
          badgeCount={99}
          right={
            <Image style={tw`w-7 h-7 mr-5`} source={require('@/assets/images/home/info.png')} />
          }
          data={yourItemsArray}
          item={
            <LinearGradient
              colors={['#F14375', '#F67640']}
              style={tw`h-full w-full rounded-3xl flex flex-row left-[-43px] items-center`}>
              <View style={tw`bg-transparent w-1/2 h-full p-6`}>
                <View style={tw`bg-[#f67868] w-23 h-23 rounded-full justify-center items-center`}>
                  <Image
                    style={tw`w-16 h-16`}
                    source={require('@/assets/images/home/rewards.png')}
                  />
                </View>
                <Text style={tw`text-[20px] text-white font-bold mt-3 mb-1`}>Vouchers</Text>
                <Text style={tw`text-[16px] text-white`}>2 Items</Text>
              </View>
              <Image
                style={tw`w-45 h-9/10`}
                source={require('@/assets/images/home/yourItems.png')}
              />
            </LinearGradient>
          }
          setActiveIndex={setYourItemIndex}
          activeIndex={yourItemIndex}
        />
      </ScrollView>
    </LinearGradient>
  );
}
