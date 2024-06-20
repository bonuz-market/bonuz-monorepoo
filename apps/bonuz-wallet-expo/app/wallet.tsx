/* eslint-disable unicorn/consistent-function-scoping */
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Image, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import { Text, View } from '@/components/Themed';
import { WalletSheet } from '@/pages/wallet/sheets';
import { networkTypes } from '@/store/walletTypes';

export default function Wallet() {
  const { navigate } = useRouter();

  const bottomModalRef = useRef<BottomSheetModal>(null);

  const [walletType, setWalletType] = useState<string>('Smart Wallet');
  const [networkType, setNetworkType] = useState<number>(0);

  const [option, setOption] = useState<string>('receiveType');

  const [currentSection, setCurrentSection] = useState<string>('wallet');

  const handlePresentModalPress = useCallback(() => {
    bottomModalRef.current?.present();
  }, []);

  const handleNext = (section: string) => {
    setCurrentSection(section);
    setOption(section);
    return handlePresentModalPress();
  };

  return (
    <BottomSheetModalProvider>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
        <StatusBar backgroundColor={'#5137B1'} />
        <View
          style={[
            tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
            { paddingTop: StatusBarHeight() },
          ]}>
          <TouchableOpacity onPress={() => navigate('/home')}>
            <View
              style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
              <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
            </View>
          </TouchableOpacity>
          <View style={tw`flex bg-transparent justify-center items-center`}>
            <TouchableOpacity onPress={() => handleNext('wallet')}>
              <Text style={tw`text-[20px] text-white font-semibold`}>{walletType} 🔽</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNext('network')}>
              <View style={tw`flex-row bg-transparent gap-2 pt-1 items-center`}>
                <Image
                  style={tw`w-[20px] h-[20px]`}
                  source={require('@/assets/images/cart/worldIcon.png')}
                />
                <View style={tw`bg-transparent flex flex-row justify-center items-center gap-2`}>
                  <Text style={tw`text-[14px] font-medium text-white`}>
                    {networkTypes[networkType].network}
                  </Text>
                  <Image
                    style={tw`w-[10px] h-[5.83px] items-center justify-center`}
                    source={require('@/assets/images/cart/downIcon.png')}
                  />
                </View>
              </View>
            </TouchableOpacity>
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
        <WalletSheet
          ref={bottomModalRef}
          walletType={walletType}
          setWalletType={setWalletType}
          networkType={networkType}
          setNetworkType={setNetworkType}
          currentSection={currentSection}
          handleNext={handleNext}
          option={option}
          setOption={setOption}
        />
      </LinearGradient>
    </BottomSheetModalProvider>
  );
}
