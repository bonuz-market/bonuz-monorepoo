/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import { NftData } from '@/entities/wallet';

interface NftsSheetProps {
    nftData: NftData;
}

export const NftsSheet = forwardRef<BottomSheetModal, NftsSheetProps>(
    ({ nftData }, bottomSheetModalRef) => {
        const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
        useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

        const snapPoints = useMemo(() => ['65%'], []);

        const handleDismissModalPress = useCallback(() => {
            _bottomSheetModalRef.current?.dismiss();
        }, []);

        return (
            <View style={tw`flex-1 bg-transparent`}>
                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: 'transparent' }}
                    ref={_bottomSheetModalRef}
                    keyboardBlurBehavior="restore"
                    index={0}
                    handleIndicatorStyle={tw`bg-[#905CFF] top-3 h-1 w-10`}
                    snapPoints={snapPoints}>
                    <BottomSheetView style={tw`flex-1`}>
                        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
                            <ScrollView
                                contentContainerStyle={{
                                    display: 'flex',
                                }}>
                                <View
                                    style={tw`bg-transparent flex-col justify-between p-3 mx-5 mt-3 mb-3 bg-[#291167] rounded-xl`}>
                                    <View style={tw`bg-transparent items-center`}>
                                        <Image style={tw`w-[200px] h-[260px]`} source={{ uri: nftData.content.preview.url }} />
                                    </View>
                                    <Text style={tw`text-[#FFFFFF] font-bold text-[16px] mt-3`}>{nftData.name}</Text>
                                    <View>
                                        <View style={tw`bg-transparent mx-5 mt-6`}>
                                            <Text style={tw`text-white text-[14px] font-medium`}>Enter wallet address</Text>
                                            <View
                                                style={tw`py-2 px-2 flex flex-row items-center bg-[#040D5B] mt-2 w-full h-10 rounded-md`}>
                                                <TextInput
                                                    placeholderTextColor={'#BAB3E2'}
                                                    placeholder="Enter address"
                                                    style={tw`text-[16px] font-normal text-white w-80`}
                                                />
                                            </View>
                                            <TouchableOpacity onPress={() => { console.log("clicked"); handleDismissModalPress() }}>
                                                <LinearGradient
                                                    colors={['#5137B1', '#291167']}
                                                    style={tw`bg-transparent mt-3 p-3 justify-center items-center rounded-md`}>
                                                    <Text style={tw`text-white text-[16px]`}>Send</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </LinearGradient>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        );
    }
);

NftsSheet.displayName = 'NftsSheet';
