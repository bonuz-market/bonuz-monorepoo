/* eslint-disable unicorn/consistent-function-scoping */
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import { NftsSheet } from '@/pages/nfts/sheets';
import { convertDate, truncateAddress } from '@/utils/wallet';

export default function Nfts() {
  const { navigate } = useRouter();
  const route = useRoute();
  const { paramName } = route.params;
  const bottomModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomModalRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
        <StatusBar backgroundColor={'#5137B1'} />
        <View
          style={[
            tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
            { paddingTop: StatusBarHeight() },
          ]}>
          <TouchableOpacity onPress={() => navigate('/wallet')}>
            <View
              style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
              <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
            </View>
          </TouchableOpacity>
          <View style={tw`flex bg-transparent justify-center items-center`}>
            <Text style={tw`text-[20px] text-[#FFFFFF] font-semibold tracking-wider`}>
              NFT Details
            </Text>
          </View>
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
        <ScrollView
          contentContainerStyle={{
            display: 'flex',
          }}>
          <View
            style={tw`bg-transparent flex-col justify-between p-3 mx-5 mt-3 mb-3 bg-[#291167] rounded-xl`}>
            <Image style={tw`w-full h-[200px]`} source={{ uri: paramName.content.preview.url }} />
            <Text style={tw`text-[#FFFFFF] font-semibold text-[30px] mt-3`}>{paramName.name}</Text>
            <Text style={tw`text-[#FFFFFF] font-semibold text-[20px] mt-3`}>Description</Text>
            <Text style={tw`text-[#9B9AA7] text-[16px] mt-1`}>{paramName.description}</Text>
            <View style={tw`bg-transparent mt-1 flex flex-row justify-between`}>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>Contract</Text>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>
                {truncateAddress(paramName.contract_address)}
              </Text>
            </View>
            <View style={tw`bg-transparent mt-1 flex flex-row justify-between`}>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>Token ID</Text>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>{paramName.token_id}</Text>
            </View>
            <View style={tw`bg-transparent mt-1 flex flex-row justify-between`}>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>Interface</Text>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>{paramName.interfaces[0]}</Text>
            </View>
            <View style={tw`bg-transparent mt-1 flex flex-row justify-between`}>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>Minted At</Text>
              <Text style={tw`text-[#FFFFFF] text-[16px]`}>
                {convertDate(paramName.last_transferred_at)}
              </Text>
            </View>
            <Link style={tw`bg-transparent mt-2`} href={paramName.external_url}>
              <Text style={tw`text-[#5B98EE] text-[16px]`}>View on Opensea</Text>
            </Link>
            <Text style={tw`text-[#9B9AA7] text-[16px] mt-2`}>
              Be careful when interacting with external links
            </Text>
          </View>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <LinearGradient
              colors={['#5137B1', '#291167']}
              style={tw`bg-transparent m-5 p-3 justify-center items-center`}>
              <Text style={tw`text-white text-[16px]`}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
          <NftsSheet ref={bottomModalRef} nftData={paramName} />
        </ScrollView>
      </LinearGradient>
    </BottomSheetModalProvider>
  );
}
