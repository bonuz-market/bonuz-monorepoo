/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import ActivityInfoSection from '@/components/ActivityInfo';
import NetworkTypesSection from '@/components/NetworkTypesSection';
import NftInfoSection from '@/components/NftInfo';
import ReceiveComponent from '@/components/ReceiveComponent';
import SwitchButton from '@/components/SwtichButton';
import TokenInfoSection from '@/components/TokenInfo';
import WalletTypesSection from '@/components/WalletTypesSection';
import WalletUnConnected from '@/components/WalletUnConnected';
import { useUserStore } from '@/store';
import { networkTypes, NftDataProps, TokenData, TransactionDataProps, WalletDataProps, walletTypes } from '@/store/walletTypes';
import { isNotEmpty } from '@/utils/object';
import { truncateAddress } from '@/utils/wallet';
import SwapComponent from '@/components/SwapComponent';

interface WalletSheetProps {
    walletType: string;
    setWalletType: any;
    networkType: number;
    setNetworkType: any;
    currentSection: string;
    handleNext: any;
    option: string;
    setOption: any;
}

export const WalletSheet = forwardRef<BottomSheetModal, WalletSheetProps>(
    (
        { walletType, setWalletType, networkType, setNetworkType, currentSection, handleNext, option, setOption },
        bottomSheetModalRef,
    ) => {
        const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
        const bottomSwapModalRef = useRef<BottomSheetModal>(null);
        useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

        const [value, setValue] = useState<string>('Crypto');
        const [walletData, setWalletData] = useState<WalletDataProps[]>([]);
        const [walletNftData, setWalletNftData] = useState<NftDataProps[]>([]);
        const [walletTransactionData, setWalletTransactionData] = useState<TransactionDataProps[]>([]);

        const [tokenData, setTokenData] = useState<TokenData[]>([]);
        const [nftData, setNftData] = useState<any[]>([]);
        const [activityData, setActivityData] = useState<any[]>([]);

        const [walletAddress, setWalletAddress] = useState<string>('0x00...00000');
        const [totalBalance, setTotalBalance] = useState<string>('0');
        const [swapNetwork, setSwapNetwork] = useState<string>(networkTypes[networkType].network);
        const [destinationNetwork, setDestinationNetwork] = useState<string>(networkTypes[networkType].network);

        const [flag, setFlag] = useState<string>('swap');
        const [loading, setLoading] = useState(false);


        const snapPoints = ['80%'];
        const swapSnapPoints = ['50%'];

        const handleDismissModalPress = useCallback(() => {
            _bottomSheetModalRef.current?.dismiss();
        }, []);

        const handleDismissSwapModalPress = useCallback(() => {
            bottomSwapModalRef.current?.dismiss();
        }, []);

        const { auth, user, wallet } = useUserStore(
            useShallow((store) => ({
                auth: store.auth,
                user: store.user,
                wallet: store.wallet,
            })),
        );

        const convertDate = (timestamp: string) => {
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
        };

        const buildUrl = (value: string, networkType: number, walletAddress: string) => {
            let baseUrl = 'https://admin.bonuz.xyz/api/users/wallet';

            let endpoint = `/balance`;
            if (value === 'NFTs') {
                endpoint = `/nfts`;
            } else if (value === 'Activity') {
                endpoint = `/transactions`;
            }

            let url = `${baseUrl}/${walletAddress}${endpoint}`;

            if (networkType !== 0) {
                url += `?chainId=${networkTypes[networkType].chainId}`;
            }

            return url;
        };

        useEffect(() => {
            if (wallet.address) {
                setLoading(true);
                setWalletData([]);
                setWalletNftData([]);
                setWalletAddress(truncateAddress(wallet.address));
                setSwapNetwork(networkTypes[networkType].network);
                const url = buildUrl(value, networkType, wallet.address);
                fetch(url) // Replace with your API URL
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data: any) => {
                        switch (value) {
                            case 'Crypto': {
                                setTokenData(data.data.tokens);
                                setLoading(false);
                                break;
                            }
                            case 'NFTs': {
                                setNftData(data.data.nfts);
                                setLoading(false);
                                break;
                            }
                            case 'Activity': {
                                setActivityData(data.data.transactions);
                                setLoading(false);
                                break;
                            }
                            default: {
                                console.log('Unknown value:', value);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log('fetch error:', error);
                        setLoading(false);
                    });
            }
        }, [value, wallet, networkType]);

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
                        chainId: token.chainId,
                        contractAddress: token.address,
                    });
                    sum += Number(token.quote);
                });
                setTotalBalance(Number(sum).toFixed(2));
                setWalletData(dataArray);
            }
            if (nftData.length > 0 && value === 'NFTs') {
                let dataArray: React.SetStateAction<NftDataProps[]> = [];
                nftData.map((data: any, index: number) => {
                    dataArray.push({
                        id: index + 1,
                        avatar: { uri: data.content.preview.url },
                        name: data.name,
                        description: data.description,
                        date: convertDate(data.last_transferred_at),
                        contract_address: truncateAddress(data.contract_address),
                        token_Id: data.token_id,
                        interface: data.interfaces[0],
                        openseaUrl: data.external_url,
                    });
                });
                setWalletNftData(dataArray);
            }
            if (activityData.length > 0 && value === 'Activity') {
                let dataArray: React.SetStateAction<TransactionDataProps[]> = [];
                activityData.map((data: any, index: number) => {
                    dataArray.push({
                        id: index + 1,
                        senderAddress: truncateAddress(data.from),
                        receiverAddress: truncateAddress(data.to),
                        transferAmount: '~$' + Number(data.quote).toFixed(2),
                        tokenName: data.name,
                        tokenSymbol: data.symbol,
                        date: convertDate(data.timestamp),
                        explorerUrl: data.explorerUrl,
                    });
                });
                setWalletTransactionData(dataArray);
            }
        }, [tokenData, nftData, activityData, value]);

        const handleSwapPresentModalPress = useCallback(() => {
            bottomSwapModalRef.current?.present();
        }, []);

        const handleSwapNext = (session: string) => {
            setFlag(session);
            return handleSwapPresentModalPress();
        };

        const handleNetwork = (networkString: string) => {
            if (flag === 'swap')
                setSwapNetwork(networkString);
            else
                setDestinationNetwork(networkString);
        }
        return (
            <View style={tw`flex-1 bg-transparent`}>
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
                                    <TouchableOpacity onPress={() => handleNext('receive')}>
                                        <Image
                                            style={tw`w-[54px]`}
                                            source={require('@/assets/images/cart/receive.png')}
                                        />
                                    </TouchableOpacity>
                                    <Text style={tw`text-[13px] text-white font-medium`}>Receive</Text>
                                </View>
                                <View style={tw`bg-transparent items-center text-center gap-2`}>
                                    <TouchableOpacity onPress={() => handleNext('swap')}>
                                        <Image style={tw`w-[54px]`} source={require('@/assets/images/cart/swap.png')} />
                                    </TouchableOpacity>
                                    <Text style={tw`text-[13px] text-white font-medium`}>Swap</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </ScrollView>
                {
                    isNotEmpty(auth) && isNotEmpty(user) ? (
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
                    )
                }
                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: 'transparent' }}
                    ref={_bottomSheetModalRef}
                    keyboardBlurBehavior="restore"
                    index={0}
                    handleIndicatorStyle={tw`bg-[#905CFF] top-3 h-1 w-10`}
                    snapPoints={snapPoints}>
                    <BottomSheetView style={tw`flex-1`}>
                        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
                            <BottomSheetModalProvider>
                                <ScrollView style={tw`bg-transparent flex-1`}>
                                    {currentSection === 'wallet' && (
                                        <WalletTypesSection
                                            walletTypes={walletTypes}
                                            setWalletType={setWalletType}
                                            dismissModal={handleDismissModalPress}
                                        />
                                    )}
                                    {currentSection === 'network' && (
                                        <NetworkTypesSection
                                            networkTypes={networkTypes}
                                            setNetworkType={setNetworkType}
                                            dismissModal={handleDismissModalPress}
                                        />
                                    )}
                                    {currentSection === 'receive' && (
                                        <View>
                                            <View style={tw`flex flex-row mx-10 justify-between my-5`}>
                                                <TouchableOpacity onPress={() => setOption('receive')}>
                                                    <Text style={[tw`text-[20px] text-white p-2`, option === 'receive' && tw`border-[#EC6640] border-b-2`]}>Receive</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setOption('buyType')}>
                                                    <Text style={[tw`text-[20px] text-white`, option === 'buyType' && tw`border-[#EC6640] border-b-2`]}>Buy</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {option === 'receive' ? (
                                                <ReceiveComponent walletAddress={wallet.address} handleDismissModalPress={handleDismissModalPress} />
                                            ) : (
                                                <Text style={tw`text-center text-white text-[20px]`}>Coming Soon...</Text>
                                            )}
                                        </View>
                                    )}
                                    {currentSection === 'swap' && (
                                        <SwapComponent setOption={setOption} option={option} handleSwapNext={handleSwapNext} swapNetwork={swapNetwork} destinationNetwork={destinationNetwork} handleDismissSwapModalPress={handleDismissSwapModalPress} />
                                    )}
                                    <BottomSheetModal
                                        backgroundStyle={{ backgroundColor: 'white' }}
                                        ref={bottomSwapModalRef}
                                        keyboardBlurBehavior="restore"
                                        index={0}
                                        handleIndicatorStyle={tw`bg-black h-1 w-10`}
                                        snapPoints={swapSnapPoints}>
                                        <BottomSheetView style={tw`flex-1 p-5 gap-4`}>
                                            {networkTypes.map((value, index) => (
                                                <>
                                                    {swapNetwork !== value.network && (
                                                        <TouchableOpacity key={index} onPress={() => { handleNetwork(value.network); handleDismissSwapModalPress(); }}>
                                                            <Text style={tw`text-[20px] w-full`}>{value.network}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </>
                                            ))}
                                        </BottomSheetView>
                                    </BottomSheetModal>
                                </ScrollView>
                            </BottomSheetModalProvider>
                        </LinearGradient>
                    </BottomSheetView>
                </BottomSheetModal>

            </View >
        );
    });

WalletSheet.displayName = 'WalletSheet';
