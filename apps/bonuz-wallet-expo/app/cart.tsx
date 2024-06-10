/* eslint-disable sonarjs/no-all-duplicated-branches */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import { StatusBarHeight } from '@/components/StatusbarHeight';
// import SwitchButton from '@/components/SwtichButton';
import { Text, View } from '@/components/Themed';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

const walletMockData = {
  address: '0x71A0...6a6a',
  balance: '13,941,41',
};

const defaultWalletData = {
  address: '0x00...0000',
  balance: '0',
};

const coinDatas = [
  {
    id: 1,
    avatar: require('@/assets/images/cart/ethereum.png'),
    name: 'Ethereum',
    network: '',
    tokenAmount: '3.3461',
    tokenPrice: '~$4,141.25',
  },
  {
    id: 2,
    avatar: require('@/assets/images/cart/usdc.png'),
    name: 'USDC',
    network: 'Polygon',
    tokenAmount: '3,941.81',
    tokenPrice: '~$3,941.81',
  },
  {
    id: 3,
    avatar: require('@/assets/images/cart/bitcoin.png'),
    name: 'Bitcoin',
    network: '',
    tokenAmount: '0.1906',
    tokenPrice: '~$3,277.53',
  },
  {
    id: 4,
    avatar: require('@/assets/images/cart/bnb.png'),
    name: 'BNB',
    network: '',
    tokenAmount: '5.0998',
    tokenPrice: '~$1,423.87',
  },
  {
    id: 5,
    avatar: require('@/assets/images/cart/solana.png'),
    name: 'Solana',
    network: '',
    tokenAmount: '1,602.98',
    tokenPrice: '~$1,21.2.81',
  },
  {
    id: 6,
    avatar: require('@/assets/images/cart/ethereum.png'),
    name: 'Ethereum',
    network: '',
    tokenAmount: '3.3461',
    tokenPrice: '~$4,141.25',
  },
  {
    id: 7,
    avatar: require('@/assets/images/cart/usdc.png'),
    name: 'USDC',
    network: 'Polygon',
    tokenAmount: '3,941.81',
    tokenPrice: '~$3,941.81',
  },
  {
    id: 8,
    avatar: require('@/assets/images/cart/bitcoin.png'),
    name: 'Bitcoin',
    network: '',
    tokenAmount: '0.1906',
    tokenPrice: '~$3,277.53',
  },
  {
    id: 9,
    avatar: require('@/assets/images/cart/bnb.png'),
    name: 'BNB',
    network: '',
    tokenAmount: '5.0998',
    tokenPrice: '~$1,423.87',
  },
  {
    id: 10,
    avatar: require('@/assets/images/cart/solana.png'),
    name: 'Solana',
    network: '',
    tokenAmount: '1,602.98',
    tokenPrice: '~$1,21.2.81',
  },
];

export default function Cart() {
  const { navigate } = useRouter();

  const { auth, user } = useUserStore(
    useShallow((store) => ({
      auth: store.auth,
      user: store.user,
    })),
  );

  // const [isEnabled, setEnabled] = useState(false);

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
          { paddingTop: StatusBarHeight() },
        ]}>
        <TouchableOpacity onPress={() => navigate('/home')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
          </View>
        </TouchableOpacity>
        <View style={tw`flex bg-transparent justify-center items-center`}>
          <Text style={tw`text-[20px] text-white font-semibold`}>Smart Wallet</Text>
          <View style={tw`flex-row bg-transparent gap-2 pt-1 items-center`}>
            <Image
              style={tw`w-[20px] h-[20px]`}
              source={require('@/assets/images/cart/worldIcon.png')}
            />
            <Text style={tw`text-[14px] font-medium text-white`}>All Networks</Text>
            <Image
              style={tw`w-[10px] h-[5.83px]`}
              source={require('@/assets/images/cart/downIcon.png')}
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigate('/cart')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/compassIcon.png')} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          display: 'flex',
        }}
        style={tw`flex-1 mt-[30] bg-transparent`}>
        <ImageBackground
          source={require('@/assets/images/cart/walletBackground.png')}
          style={tw`h-full w-9/10 rounded-3xl left-2/20 flex-row overflow-hidden`}>
          <View style={tw`w-full bg-transparent p-5 h-full`}>
            {isNotEmpty(auth) && isNotEmpty(user) ? (
              <View style={tw`bg-transparent`}>
                <Text style={tw`font-semibold text-[18px] text-white`}>Main Wallet</Text>
                <Text style={tw`font-medium text-[14px] text-white`}>{walletMockData.address}</Text>
                <View style={tw`bg-transparent flex-1 flex-row items-center gap-2`}>
                  <Text style={tw`text-[20px] text-white font-semibold`}>
                    ${walletMockData.balance}
                  </Text>
                  <Image
                    style={tw`w-[20.11px] h-[14px]`}
                    source={require('@/assets/images/cart/eyeIcon.png')}
                  />
                </View>
              </View>
            ) : (
              <View style={tw`bg-transparent`}>
                <Text style={tw`font-semibold text-[18px] text-white`}>Main Wallet</Text>
                <Text style={tw`font-medium text-[14px] text-white mt-1`}>
                  {defaultWalletData.address}
                </Text>
                <View style={tw`bg-transparent flex-1 flex-row items-center gap-2 mt-4`}>
                  <Text style={tw`text-[20px] text-white font-semibold`}>
                    ${defaultWalletData.balance}
                  </Text>
                  <Image
                    style={tw`w-[20.11px] h-[14px]`}
                    source={require('@/assets/images/cart/eyeIcon.png')}
                  />
                </View>
              </View>
            )}
            <View style={tw`flex flex-row bg-transparent justify-between pt-6 px-8`}>
              <View style={tw`bg-transparent items-center text-center gap-2`}>
                <Image style={tw`w-[54px]`} source={require('@/assets/images/cart/receive.png')} />
                <Text style={tw`text-[13px] text-white font-medium`}>Receive</Text>
              </View>
              <View style={tw`bg-transparent items-center text-center gap-2`}>
                <Image style={tw`w-[54px]`} source={require('@/assets/images/cart/swap.png')} />
                <Text style={tw`text-[13px] text-white font-medium`}>Swap</Text>
              </View>
              <View style={tw`bg-transparent items-center text-center gap-2`}>
                <Image style={tw`w-[54px]`} source={require('@/assets/images/cart/send.png')} />
                <Text style={tw`text-[13px] text-white font-medium`}>Send</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>

      {isNotEmpty(auth) && isNotEmpty(user) ? (
        <ScrollView style={tw`bg-transparent flex-1`}>
          {coinDatas.map((coindata, index) => (
            <View key={index} style={tw`bg-transparent flex-row justify-between p-3`}>
              <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                <Image source={coindata.avatar} />
                <View style={tw`bg-transparent`}>
                  <Text style={tw`text-[16px] text-white font-semibold`}>{coindata.name}</Text>
                  {coindata.network !== '' && (
                    <Text
                      style={tw`text-[12px] font-normal text-white bg-[#3953FF] px-2 rounded-2`}>
                      {coindata.network}
                    </Text>
                  )}
                </View>
              </View>
              <View style={tw`bg-transparent`}>
                <Text>{coindata.tokenAmount}</Text>
                <Text>{coindata.tokenPrice}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={tw`mx-5`}>
          <View
            style={tw`bg-transparent flex flex-row items-center justify-between bg-[#373BA1] p-3 rounded-4`}>
            <View style={tw`bg-transparent flex flex-row gap-4`}>
              <View style={tw`w-[50px] bg-[#2F1385] rounded-2`} />
              <View style={tw`bg-transparent gap-2`}>
                <Text style={tw`text-[20px] font-bold text-[#FFFFFF]`}>Login to continue</Text>
                <Text style={tw`text-[13px] font-normal text-[#FFFFFF]`}>
                  Generate Keyless MFC Wallet
                </Text>
              </View>
            </View>
            <View style={tw`bg-transparent`}>
              <Image source={require('@/assets/images/cart/rightIcon.png')} />
            </View>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}
