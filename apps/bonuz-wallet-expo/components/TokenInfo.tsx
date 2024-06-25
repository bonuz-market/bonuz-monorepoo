/* eslint-disable prettier/prettier */
import { useNavigation } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import { TokenData } from '@/entities/wallet';
import { formatPrice } from '@/utils/wallet';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';


export default function TokenInfoSection(props: { value: any; loadingStatus: any }) {
    const { value, loadingStatus } = props;
    const navigation = useNavigation();

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
                                value.map((coindata: TokenData, index: number) => (
                                    <TouchableOpacity key={index} style={tw`bg-transparent flex-row justify-between p-3 mx-5`} onPress={() => { navigation.navigate('tokens', { paramName: coindata }); }}>
                                        <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                                            <Image style={tw`w-[30px] h-[30px]`} source={{ uri: coindata.logoURI }} />
                                            <View style={tw`bg-transparent`}>
                                                <Text style={tw`text-[16px] text-white font-semibold`}>{coindata.name}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`bg-transparent items-end`}>
                                            <Text style={tw`text-white text-[16px] font-semibold`}>{formatPrice(Number(coindata.balance))}</Text>
                                            <Text style={tw`text-white text-[14px] font-normal`}>{formatPrice(coindata.quote)}</Text>
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
    )
}
