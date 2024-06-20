/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import ActivityInfoSection from '@/components/ActivityInfo';
import NetworkTypesSection from '@/components/NetworkTypesSection';
import NftInfoSection from '@/components/NftInfo';
import ReceiveComponent from '@/components/ReceiveComponent';
import SwapComponent from '@/components/SwapComponent';
import SwitchButton from '@/components/SwtichButton';
import TokenInfoSection from '@/components/TokenInfo';
import WalletTypesSection from '@/components/WalletTypesSection';
import WalletUnConnected from '@/components/WalletUnConnected';
import { WalletSheetProps } from '@/entities/wallet';
import { getActivityDataByWalletAddress, getNftDataByWalletAddress, getTokenDataByWalletAddress } from '@/services/backend/wallets.service';
import { useUserStore } from '@/store';
import { networkTypes, walletTypes } from '@/store/walletTypes';
import { isNotEmpty } from '@/utils/object';
import { truncateAddress } from '@/utils/wallet';



export const WalletSheet = forwardRef<BottomSheetModal, WalletSheetProps>(
    (
        { walletType, setWalletType, networkType, setNetworkType, currentSection, handleNext, option, setOption },
        bottomSheetModalRef,
    ) => {
        const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
        const bottomSwapModalRef = useRef<BottomSheetModal>(null);
        useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);


        const [value, setValue] = useState<string>('Crypto');

        const [totalBalance, setTotalBalance] = useState<string>('0');
        const [swapNetwork, setSwapNetwork] = useState<string>(networkTypes[networkType].network);
        const [destinationNetwork, setDestinationNetwork] = useState<string>(networkTypes[networkType].network);

        const [flag, setFlag] = useState<string>('swap');
        const [loading, setLoading] = useState(false);


        const snapPoints = ['70%'];
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

        const { data } = useQuery({
            queryKey: [wallet.address, networkType, value],
            queryFn: ({ queryKey }) => {
                switch (queryKey[2]) {
                    case 'Crypto': { setLoading(true); return getTokenDataByWalletAddress(queryKey[0], queryKey[1], setLoading); }
                    case 'NFTs': { setLoading(true); return getNftDataByWalletAddress(queryKey[0], queryKey[1], setLoading); }
                    case 'Activity': { setLoading(true); return getActivityDataByWalletAddress(queryKey[0], queryKey[1], setLoading); }
                }
            },
        });

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
                                <Text style={tw`font-medium text-[14px] text-white`}>{truncateAddress(wallet.address)}</Text>
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
                                    <TokenInfoSection value={data} loadingStatus={loading} />
                                )}
                                {value === 'NFTs' && <NftInfoSection value={data} loadingStatus={loading} />}
                                {value === 'Activity' && (
                                    <ActivityInfoSection value={data} loadingStatus={loading} />
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
                                        <SwapComponent setOption={setOption} option={option} handleSwapNext={handleSwapNext} swapNetwork={swapNetwork} destinationNetwork={destinationNetwork} handleDismissModalPress={handleDismissSwapModalPress} />
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
                                                <View key={index}>
                                                    {swapNetwork !== value.network && (
                                                        <TouchableOpacity key={index} onPress={() => { handleNetwork(value.network); handleDismissSwapModalPress(); }}>
                                                            <Text style={tw`text-[20px] w-full`}>{value.network}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
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
