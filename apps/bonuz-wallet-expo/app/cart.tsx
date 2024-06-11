/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable sonarjs/no-all-duplicated-branches */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import NftInfoSection from '@/components/NftInfo';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import SwitchButton from '@/components/SwtichButton';
import { Text, View } from '@/components/Themed';
import TokenInfoSection from '@/components/TokenInfo';
import WalletUnConnected from '@/components/WalletUnConnected';
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

interface NftDataProps {
  id: number;
  avatar: any;
  name: string;
  description: string;
  date: string;
}

export default function Cart() {
  const { navigate } = useRouter();
  const [value, setValue] = useState(false);
  const [walletData, setWalletData] = useState<WalletDataProps[]>([]);
  const [walletNftData, setWalletNftData] = useState<NftDataProps[]>([]);

  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [nftData, setNftData] = useState<any[]>([]);


  const [walletAddress, setWalletAddress] = useState<string>('0x00...00000');
  const [totalBalance, setTotalBalance] = useState<string>('0');

  const [loading, setLoading] = useState(false);

  const { auth, user, wallet } = useUserStore(
    useShallow((store) => ({
      auth: store.auth,
      user: store.user,
      wallet: store.wallet,
    })),
  );

  useEffect(() => {
    if (wallet && wallet.address) {
      setLoading(true);
      setWalletData([]);
      setWalletNftData([]);
      setWalletAddress(shortenWalletAddress(wallet.address));
      const url =
        value === false
          ? `https://admin.bonuz.xyz/api/users/wallet/0x0e004bE8F05D53f5E09f61EAAc2acE5314E3438f/balance`
          : `https://admin.bonuz.xyz/api/users/wallet/${wallet.address}/nfts`;
      fetch(url) // Replace with your API URL
        .then((response) => response.json())
        .then((data: TokenData[]) => {
          if (value === false) setTokenData(data.data.tokens);
          else setNftData(data.data.nfts);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [value, wallet]);

  useEffect(() => {
    if (tokenData.length > 0 && value === false) {
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
      setLoading(false);
    }
    if (nftData.length > 0 && value === true) {
      let dataArray: React.SetStateAction<NftDataProps[]> = [];
      nftData.map((data: any, index: number) => {
        dataArray.push({
          id: index + 1,
          avatar: { uri: data.content.preview.url },
          name: shortenDiscription(data.name, 36),
          description: shortenDiscription(data.description, 52),
          date: convertDate(data.last_transferred_at),
        });
      });
      setWalletNftData(dataArray);
      setLoading(false);
    }
  }, [tokenData, nftData, value]);

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

  function shortenDiscription(description: string, prefixLength: number) {
    if (!description || description.length < prefixLength) {
      return description; // If the address is too short, return as is
    }

    const prefix = description.slice(0, prefixLength);

    return `${prefix}...`;
  }

  function convertDate(timestamp: string) {
    const date = new Date(timestamp);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
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
            <TouchableOpacity onPress={() => console.log('asfdasf')}>
              <Image
                style={tw`w-[10px] h-[5.83px] items-center`}
                source={require('@/assets/images/cart/downIcon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigate('/explore')}>
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
                <TouchableOpacity>
                  <Image
                    style={tw`w-[54px]`}
                    source={require('@/assets/images/cart/receive.png')}
                  />
                </TouchableOpacity>
                <Text style={tw`text-[13px] text-white font-medium`}>Receive</Text>
              </View>
              <View style={tw`bg-transparent items-center text-center gap-2`}>
                <TouchableOpacity>
                  <Image style={tw`w-[54px]`} source={require('@/assets/images/cart/swap.png')} />
                </TouchableOpacity>
                <Text style={tw`text-[13px] text-white font-medium`}>Swap</Text>
              </View>
              <View style={tw`bg-transparent items-center text-center gap-2`}>
                <TouchableOpacity>
                  <Image style={tw`w-[54px]`} source={require('@/assets/images/cart/send.png')} />
                </TouchableOpacity>
                <Text style={tw`text-[13px] text-white font-medium`}>Send</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      {isNotEmpty(auth) && isNotEmpty(user) ? (
        <View style={tw`flex-1 bg-transparent mt-[-130]`}>
          <View style={tw`mx-5 bg-transparent mb-5`}>
            <SwitchButton value={value} onValueChange={setValue} title1="Crypto" title2="NFTs" />
          </View>
          <ScrollView style={tw`bg-transparent flex-1`}>
            {value === false ? (
              <TokenInfoSection value={walletData} loadingStatus={loading} />
            ) : (
              <NftInfoSection value={walletNftData} loadingStatus={loading} />
            )}
          </ScrollView>
        </View>
      ) : (
        <WalletUnConnected />
      )}
    </LinearGradient>
  );
}
