/* eslint-disable sonarjs/no-all-duplicated-branches */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import SwitchButton from '@/components/SwtichButton';
import { Text, View } from '@/components/Themed';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

interface TokenData {
  logoURI: string;
  symbol: string;
  balance: number;
  quote: number;
}
interface WalletDataProps {
  id: number;
  avatar: any;
  name: string;
  network: string;
  tokenAmount: string;
  tokenPrice: string;
}

export default function Cart() {
  const { navigate } = useRouter();
  const [value, setValue] = useState(false);
  const [walletData, setWalletData] = useState<WalletDataProps[]>([]);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);

  const [walletAddress, setWalletAddress] = useState<string>('0x00...00000');
  const [totalBalance, setTotalBalance] = useState<string>('0');

  const { auth, user, wallet } = useUserStore(
    useShallow((store) => ({
      auth: store.auth,
      user: store.user,
      wallet: store.wallet,
    })),
  );

  useEffect(() => {
    if (wallet && wallet.address) {
      setWalletAddress(shortenWalletAddress(wallet.address));
      if (value === false) {
        fetch(
          'https://admin.bonuz.xyz/api/users/wallet/0x0e004bE8F05D53f5E09f61EAAc2acE5314E3438f/balance',
        ) // Replace with your API URL
          .then((response) => response.json())
          .then((data: TokenData[]) => {
            setTokenData(data.data.tokens);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
      }
    }
  }, [value, wallet]);

  useEffect(() => {
    if (tokenData.length > 0) {
      let sum = 0,
        dataArray: React.SetStateAction<WalletDataProps[]> = [];
      tokenData.map((token, index) => {
        dataArray.push({
          id: index + 1,
          avatar: { uri: token.logoURI },
          name: token.symbol,
          network: '',
          tokenAmount: Number(token.balance).toFixed(4),
          tokenPrice: '~$' + Number(token.quote).toFixed(2),
        });
        sum += Number(token.quote);
      });
      setTotalBalance(Number(sum).toFixed(2));
      setWalletData(dataArray);
    }
  }, [tokenData]);


  // eslint-disable-next-line unicorn/consistent-function-scoping
  function shortenWalletAddress(walletAddress: string) {
    if (!walletAddress || walletAddress.length < 10) {
      return walletAddress; // If the address is too short, return as is
    }

    const prefixLength = 5; // Number of characters to keep from the start
    const suffixLength = 4; // Number of characters to keep from the end

    const prefix = walletAddress.slice(0, prefixLength);
    const suffix = walletAddress.slice(-suffixLength);

    return `${prefix}...${suffix}`;
  }

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
          style={tw`rounded-3xl flex-row overflow-hidden mx-5`}>
          <View style={tw`w-full bg-transparent p-5 h-full`}>
            <View style={tw`bg-transparent`}>
              <Text style={tw`font-semibold text-[18px] text-white`}>Main Wallet</Text>
              <Text style={tw`font-medium text-[14px] text-white`}>{walletAddress}</Text>
              <View style={tw`bg-transparent flex-1 flex-row items-center gap-2 mt-4`}>
                <Text style={tw`text-[20px] text-white font-semibold`}>${totalBalance}</Text>
                <Image
                  style={tw`w-[20.11px] h-[14px]`}
                  source={require('@/assets/images/cart/eyeIcon.png')}
                />
              </View>
            </View>

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
        <View style={tw`flex-1 bg-transparent mt-[-130]`}>
          <View style={tw`mx-5 bg-transparent mb-5`}>
            <SwitchButton value={value} onValueChange={setValue} title1="Crypt" title2="NFTs" />
          </View>
          <ScrollView style={tw`bg-transparent flex-1`}>
            {walletData.map((coindata, index) => (
              <View key={index} style={tw`bg-transparent flex-row justify-between p-3 mx-5`}>
                <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                  <Image style={tw`w-[30px] h-[30px]`} source={coindata.avatar} />
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
                <View style={tw`bg-transparent items-end`}>
                  <Text style={tw`text-white text-[16px] font-semibold`}>
                    {coindata.tokenAmount}
                  </Text>
                  <Text style={tw`text-white text-[14px] font-normal`}>{coindata.tokenPrice}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <ScrollView style={tw`mx-5`}>
          <View
            style={tw`bg-transparent flex flex-row items-center justify-between bg-[#373BA1] p-3 mx-5 rounded-4`}>
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
