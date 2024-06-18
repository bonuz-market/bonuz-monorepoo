/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import { TransactionDataProps } from '@/store/walletTypes';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';

export default function ActivityInfoSection(props: { value: any; loadingStatus: boolean }) {
    const { value, loadingStatus } = props;

    return (
        <>
            {loadingStatus === true ? (
                <LoadingSection />
            ) : (
                <>
                    {value.length > 0 ? (
                        value.map((transactionData: TransactionDataProps, index: number) => (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(transactionData.explorerUrl)}>
                                <View
                                    style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 mb-3 bg-[#313CA6] rounded-xl`}>
                                    <View style={tw`bg-transparent flex flex-row items-center justify-between w-full`}>
                                        <View style={tw`bg-transparent flex flex-col gap-2`}>
                                            <Text style={tw`text-[16px] text-white font-semibold flex-wrap`}>
                                                {transactionData.senderAddress}
                                            </Text>
                                            <Text style={tw`text-[12px] font-normal text-white`}>
                                                {transactionData.receiverAddress}
                                            </Text>
                                            <Text style={tw`text-[12px] font-normal text-white`}>
                                                {transactionData.date}
                                            </Text>
                                        </View>
                                        <View style={tw`bg-transparent`}>
                                            <Text style={tw`text-white text-[14px] font-normal`}>{transactionData.transferAmount}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <NoItemSection />
                    )}
                </>
            )
            }
        </>
    );
}
