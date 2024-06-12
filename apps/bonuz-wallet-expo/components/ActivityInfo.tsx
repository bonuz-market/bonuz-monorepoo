import React from 'react';
import { Image, Text, View } from 'react-native';
import tw from 'twrnc';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';

interface ActivityDataProps {
    id: number;
    senderAddress: string;
    receiverAddress: string;
    tokenAmount: string;
    transferAmount: string;
    tokenName: string;
    tokenSymbol: string;
    date: string;
}

export default function ActivityInfoSection(props: { value: any; loadingStatus: boolean }) {
    const { value, loadingStatus } = props;

    return (
        <>
            {loadingStatus === true ? (
                <LoadingSection />
            ) : (
                <>
                    {value.length > 0 ? (
                        value.map((transactionData: ActivityDataProps, index: number) => (
                            <View
                                key={index}
                                style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 mb-3 bg-[#291167] rounded-xl`}>
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
                                        <Text style={tw`text-white text-[16px] font-semibold`}>{transactionData.tokenAmount}</Text>
                                        <Text style={tw`text-white text-[14px] font-normal`}>{transactionData.transferAmount}</Text>
                                    </View>
                                </View>
                            </View>
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
