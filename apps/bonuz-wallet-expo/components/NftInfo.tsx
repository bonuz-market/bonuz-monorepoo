import React from 'react';
import { Image, Text, View } from 'react-native';
import tw from 'twrnc';

interface NftDataProps {
    id: number;
    avatar: any;
    name: string;
    description: string;
}

export default function NftInfoSection(props: { value: any; loadingStatus: boolean }) {
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
                        value.map((coindata: NftDataProps, index: number) => (
                            <View
                                key={index}
                                style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 bg-[#291167] rounded-xl`}>
                                <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                                    <Image style={tw`w-[80px] h-[80px]`} source={coindata.avatar} />
                                    <View style={tw`bg-transparent flex flex-col flex-wrap gap-2`}>
                                        <Text style={tw`text-[16px] text-white font-semibold`}>{coindata.name}</Text>
                                        <Text style={tw`text-[12px] font-normal text-white`}>
                                            {coindata.description}
                                        </Text>
                                    </View>
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
