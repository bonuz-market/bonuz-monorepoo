/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
import { useNavigation } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import { NftData } from '@/entities/wallet';
import { convertDate, shortenDiscription } from '@/utils/wallet';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';

export default function NftInfoSection(props: { value: any; loadingStatus: boolean }) {
    const { value, loadingStatus } = props;
    const navigation = useNavigation();

    const onPressEvent = (index: number) => {
        console.log('index:', index);
    };

    return (
        <View>
            {loadingStatus === true ? (
                <LoadingSection />
            ) : (
                <View>
                    {value === undefined ? (
                        <NoItemSection />
                    ) : (
                        <View>
                            {value.length > 0 ? (
                                value.map((nftData: NftData, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            onPressEvent(index + 1);
                                            navigation.navigate('nfts', { paramName: nftData });
                                        }}
                                    >
                                        <View
                                            style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 mb-3 bg-[#313CA6] rounded-xl`}>
                                            <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                                                <Image style={tw`w-[80px] h-[80px]`} source={{ uri: nftData.content.preview.url }} />
                                                <View style={tw`bg-transparent w-78/100 flex flex-col gap-2`}>
                                                    <Text style={tw`text-[16px] text-white font-semibold flex-wrap`}>
                                                        {shortenDiscription(nftData.name, 36)}
                                                    </Text>
                                                    <Text style={tw`text-[12px] font-normal text-white`}>
                                                        {shortenDiscription(nftData.description, 52)}
                                                    </Text>
                                                    <Text style={tw`text-[12px] font-normal text-white`}>{convertDate(nftData.last_transferred_at)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <NoItemSection />
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}