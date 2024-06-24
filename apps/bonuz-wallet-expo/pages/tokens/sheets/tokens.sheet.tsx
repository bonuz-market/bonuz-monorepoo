/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import ActivityInfoSection from '@/components/ActivityInfo';
import ReceiveComponent from '@/components/ReceiveComponent';
import SendComponent from '@/components/SendComponent';
import { TokenData } from '@/entities/wallet';
import { getActivityDataByTokenAddress } from '@/services/backend/wallets.service';
import { useUserStore } from '@/store';
import { formatPrice } from '@/utils/wallet';

interface NftsSheetProps {
    tokenData: TokenData;
}

export const TokensSheet = forwardRef<BottomSheetModal, NftsSheetProps>(
    ({ tokenData }, bottomSheetModalRef) => {
        const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
        const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
        const [activityType, setActivityType] = useState<string>('receive');

        useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

        const { wallet } = useUserStore(
            useShallow((store) => ({
                wallet: store.wallet,
            })),
        )

        const snapPoints = useMemo(() => ['65%'], []);

        const handleDismissModalPress = useCallback(() => {
            _bottomSheetModalRef.current?.dismiss();
        }, []);

        const handlePresentModalPress = useCallback(() => {
            _bottomSheetModalRef.current?.present();
        }, []);

        const handleNext = (section: string) => {
            setActivityType(section);
            return handlePresentModalPress();
        };

        const { data } = useQuery({
            queryKey: [wallet.address, tokenData, setLoadingStatus],
            queryFn: ({ queryKey }) => {
                setLoadingStatus(true); return getActivityDataByTokenAddress(queryKey[0], queryKey[1].chainId, queryKey[1].address, queryKey[2]);
            },
        });

        return (
            <View style={tw`flex-1 bg-transparent`}>
                <View style={tw`m-5 py-6 bg-[#4736AD] rounded-xl justify-center items-center`}>
                    <Image style={tw`w-[60px] h-[60px]`} source={{ uri: tokenData.logoURI }} />
                    <View style={tw`bg-transparent flex flex-row gap-2 mt-5`}>
                        <Text style={tw`text-[16px] font-semibold text-white`}>{formatPrice(Number(tokenData.balance))}</Text>
                        <Text style={tw`text-[16px] font-semibold text-white`}>{tokenData.symbol}</Text>
                    </View>
                    <Text style={tw`text-[14px] font-medium text-[#6E6095] mt-2`}>
                        {formatPrice(tokenData.quoteRate)}
                    </Text>
                    <View style={tw`w-full bg-[#FFFFFF] h-[1px] mt-5`} />
                    <View style={tw`flex flex-row justify-between items-center mt-3 w-full`}>
                        <TouchableOpacity
                            style={tw`justify-center items-center w-1/2`}
                            onPress={() => handleNext('receive')}>
                            <Text style={tw`text-white text-[14px] font-medium`}>Receive</Text>
                        </TouchableOpacity>
                        <View style={tw`w-full bg-[#FFFFFF] h-96/100 w-[1px]`} />
                        <TouchableOpacity
                            style={tw`justify-center items-center w-1/2`}
                            onPress={() => handleNext('send')}>
                            <Text style={tw`text-white text-[14px] font-medium`}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={tw`m-5 justify-center items-center`}>
                    <Text style={tw`text-white text-[20px] font-medium`}>Recent Activity</Text>
                </View>
                <ScrollView
                    contentContainerStyle={{
                        display: 'flex',
                    }}>
                    <ActivityInfoSection value={data} loadingStatus={loadingStatus} />
                </ScrollView>
                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: 'transparent' }}
                    ref={_bottomSheetModalRef}
                    keyboardBlurBehavior="restore"
                    index={0}
                    handleIndicatorStyle={tw`bg-[#905CFF] top-3 h-1 w-10`}
                    snapPoints={snapPoints}>
                    <BottomSheetView style={tw`flex-1`}>
                        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
                            <ScrollView style={tw`bg-transparent flex-1`}>
                                {activityType === 'receive' ? (
                                    <ReceiveComponent walletAddress={wallet.address} handleDismissModalPress={handleDismissModalPress} />
                                ) : (
                                    <SendComponent handleDismissModalPress={handleDismissModalPress} />
                                )}
                            </ScrollView>
                        </LinearGradient>
                    </BottomSheetView>
                </BottomSheetModal>
            </View >
        );
    }
);

TokensSheet.displayName = 'TokensSheet';
