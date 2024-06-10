import React from 'react';
import { Image, Text, View } from 'react-native';
import tw from 'twrnc';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';

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
                <LoadingSection />
            ) : (
                <>
                    {value.length > 0 ? (
                        value.map((coindata: NftDataProps, index: number) => (
                            <View
                                key={index}
                                style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 mb-3 bg-[#291167] rounded-xl`}>
                                <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                                    <Image style={tw`w-[80px] h-[80px]`} source={coindata.avatar} />
                                    <View style={tw`bg-transparent w-78/100 flex flex-col gap-2`}>
                                        <Text style={tw`text-[16px] text-white font-semibold flex-wrap`}>
                                            {coindata.name}
                                        </Text>
                                        <Text style={tw`text-[12px] font-normal text-white`}>
                                            {coindata.description}
                                        </Text>

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
