/* eslint-disable unicorn/consistent-function-scoping */
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';

export default function Nfts(props: { nftDatasdf: any }) {
  const { navigate } = useRouter();
  const { nftDatasdf } = props;

  return (
    <BottomSheetModalProvider>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
        <StatusBar backgroundColor={'#5137B1'} />
        <View
          style={[
            tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
            { paddingTop: StatusBarHeight() },
          ]}>
          <TouchableOpacity onPress={() => navigate('/cart')}>
            <View
              style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
              <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
            </View>
          </TouchableOpacity>
          <View style={tw`flex bg-transparent justify-center items-center`}>
            <Text style={tw`text-[20px] text-[#FFFFFF] font-semibold tracking-wider`}>
              NFT Details
            </Text>
          </View>c
          <TouchableOpacity onPress={() => navigate('/explore')}>
            <View
              style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
              <Image
                style={tw`w-[30px]`}
                source={require('@/assets/images/cart/exploreIcon.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BottomSheetModalProvider>
  );
}
