import React from 'react';
import { Image, Text, View } from 'react-native';
import tw from 'twrnc';

interface WalletDataProps {
    id: number;
    avatar: any;
    name: string;
    network: string;
    tokenAmount: string;
    tokenPrice: string;
}

export default function TokenInfoSection(props: { value: any; loadingStatus: any }) {
    const { value, loadingStatus } = props;

    return (
        <>
            {loadingStatus === true ? (
                <View style={tw`bg-transparent flex-row justify-center p-3 mx-5 items-center`}>
                    <Text style={tw`text-white text-[30px]`}>Loading...</Text>
                </View>
            ) : (
                <>
                    {value.length > 0 ? (
                        value.map((coindata: WalletDataProps, index: number) => (
                            <View key={index} style={tw`bg-transparent flex-row justify-between p-3 mx-5`}>
                                <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                                    <Image style={tw`w-[30px] h-[30px]`} source={coindata.avatar} />
                                    <View style={tw`bg-transparent`}>
                                        <Text style={tw`text-[16px] text-white font-semibold`}>{coindata.name}</Text>
                                        {coindata.network !== '' && (
                                            <Text style={tw`text-[12px] font-normal text-white bg-[#3953FF] px-2 rounded-2`}>
                                                {coindata.network}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View style={tw`bg-transparent items-end`}>
                                    <Text style={tw`text-white text-[16px] font-semibold`}>{coindata.tokenAmount}</Text>
                                    <Text style={tw`text-white text-[14px] font-normal`}>{coindata.tokenPrice}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={tw`bg-transparent flex-row justify-center p-3 mx-5 items-center`}>
                            <Text style={tw`text-white text-[30px]`}>No Item</Text>
                        </View>
                    )}
                </>
            )
            }
        </>
    );
}
