/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable sonarjs/no-all-duplicated-branches */
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, ImageBackground, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import ActivityInfoSection from '@/components/ActivityInfo';
import NftInfoSection from '@/components/NftInfo';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import SwitchButton from '@/components/SwtichButton';
import { Text, View } from '@/components/Themed';
import TokenInfoSection from '@/components/TokenInfo';
import WalletUnConnected from '@/components/WalletUnConnected';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';
import WalletTypesSection from '@/components/WalletTypesSection';

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

interface TransactionDataProps {
  id: number;
  senderAddress: string;
  receiverAddress: string;
  transferAmount: string;
  tokenName: string;
  tokenSymbol: string;
  date: string;
  explorerUrl: string;
}

const walletTypes = [
  {
    id: 1,
    name: 'Smart Wallet',
    walletIcon: '',
  },
  {
    id: 2,
    name: 'EOA Wallet',
    walletIcon: '',
  },
  {
    id: 3,
    name: 'Tron Wallet',
    walletIcon: '',
  },
  {
    id: 4,
    name: 'Bitcoin Wallet',
    walletIcon: '',
  },
  {
    id: 5,
    name: 'Solana Wallet',
    walletIcon: '',
  },
  {
    id: 6,
    name: 'Ton Wallet',
    walletIcon: '',
  },
  {
    id: 7,
    name: 'Doge Wallet',
    walletIcon: '',
  },
];

export default function Cart() {
  const { navigate } = useRouter();
  const [value, setValue] = useState<string>('Crypto');
  const [walletData, setWalletData] = useState<WalletDataProps[]>([]);
  const [walletNftData, setWalletNftData] = useState<NftDataProps[]>([]);
  const [walletTransactionData, setWalletTransactionData] = useState<TransactionDataProps[]>([]);

  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [nftData, setNftData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  const [walletAddress, setWalletAddress] = useState<string>('0x00...00000');
  const [totalBalance, setTotalBalance] = useState<string>('0');

  const [loading, setLoading] = useState(false);

  const bottomSheetModalReference = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const [walletType, setWalletType] = useState<string>('Smart Wallet');


  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalReference.current?.present();
  }, []);

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
      let url = `https://admin.bonuz.xyz/api/users/wallet/0x0e004bE8F05D53f5E09f61EAAc2acE5314E3438f/balance`;
      if (value === 'NFTs') url = `https://admin.bonuz.xyz/api/users/wallet/${wallet.address}/nfts`;
      if (value === 'Activity')
        url = `https://admin.bonuz.xyz/api/users/wallet/0x0e004bE8F05D53f5E09f61EAAc2acE5314E3438f/transactions`;
      fetch(url) // Replace with your API URL
        .then((response) => response.json())
        .then((data: TokenData[]) => {
          switch (value) {
            case 'Crypto': {
              setTokenData(data.data.tokens);
              break;
            }
            case 'NFTs': {
              setNftData(data.data.nfts);
              break;
            }
            case 'Activity': {
              setActivityData(data.data.transactions);
              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [value, wallet]);

  useEffect(() => {
    if (tokenData.length > 0 && value === 'Crypto') {
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
    if (nftData.length > 0 && value === 'NFTs') {
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
    if (activityData.length > 0 && value === 'Activity') {
      let dataArray: React.SetStateAction<TransactionDataProps[]> = [];
      activityData.map((data: any, index: number) => {
        dataArray.push({
          id: index + 1,
          senderAddress: shortenWalletAddress(data.from),
          receiverAddress: shortenWalletAddress(data.to),
          transferAmount: '~$' + Number(data.quote).toFixed(2),
          tokenName: data.name,
          tokenSymbol: data.symbol,
          date: convertDate(data.timestamp),
          explorerUrl: data.explorerUrl,
        });
      });
      setWalletTransactionData(dataArray);
      setLoading(false);
    }
  }, [tokenData, nftData, activityData, value]);

  const handleNext = () => {
    console.log('clicked');
    return handlePresentModalPress();
  };

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
            <TouchableOpacity onPress={() => handleNext()}>
              <Text style={tw`text-[20px] text-white font-semibold`}>{walletType} 🔽</Text>
            </TouchableOpacity>
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
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
        {isNotEmpty(auth) && isNotEmpty(user) ? (
          <View style={tw`flex-1 bg-transparent mt-[-130]`}>
            <View style={tw`mx-5 bg-transparent mb-5`}>
              <SwitchButton
                value={value}
                onValueChange={setValue}
                titleList={['Crypto', 'NFTs', 'Activity']}
              />
            </View>
            <ScrollView style={tw`bg-transparent flex-1`}>
              {value === 'Crypto' && (
                <TokenInfoSection value={walletData} loadingStatus={loading} />
              )}
              {value === 'NFTs' && <NftInfoSection value={walletNftData} loadingStatus={loading} />}
              {value === 'Activity' && (
                <ActivityInfoSection value={walletTransactionData} loadingStatus={loading} />
              )}
            </ScrollView>
          </View>
        ) : (
          <WalletUnConnected />
        )}
        <BottomSheetModal
          backgroundStyle={{ backgroundColor: 'transparent' }}
          ref={bottomSheetModalReference}
          keyboardBlurBehavior="restore"
          index={0}
          handleIndicatorStyle={tw`bg-[#905CFF] top-3 h-1 w-10`}
          snapPoints={snapPoints}>
          <BottomSheetView style={tw`flex-1`}>
            <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
              <ScrollView style={tw`bg-transparent flex-1`}>
                <WalletTypesSection walletTypes={walletTypes} setWalletType={setWalletType} />
              </ScrollView>
            </LinearGradient>
          </BottomSheetView>
        </BottomSheetModal>
      </LinearGradient>
    </BottomSheetModalProvider>
  );
}
