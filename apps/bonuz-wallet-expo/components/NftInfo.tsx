import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';
import { useRouter } from 'expo-router';

interface NftDataProps {
    id: number;
    avatar: any;
    name: string;
    description: string;
    date: string;
}

export default function NftInfoSection(props: { value: any; loadingStatus: boolean }) {
    const { value, loadingStatus } = props;
    const { navigate } = useRouter();

    const onPressEvent = (index: number) => {
        console.log('index:', index);
    };

    return (
        <>
            {loadingStatus === true ? (
                <LoadingSection />
            ) : (
                <>
                    {value.length > 0 ? (
                        value.map((nftData: NftDataProps, index: number) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    onPressEvent(index + 1);
                                    navigate('/nfts');
                                }}
                            >
                                <View
                                    style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 mb-3 bg-[#291167] rounded-xl`}>
                                    <View style={tw`bg-transparent flex flex-row items-center gap-2`}>
                                        <Image style={tw`w-[80px] h-[80px]`} source={nftData.avatar} />
                                        <View style={tw`bg-transparent w-78/100 flex flex-col gap-2`}>
                                            <Text style={tw`text-[16px] text-white font-semibold flex-wrap`}>
                                                {nftData.name}
                                            </Text>
                                            <Text style={tw`text-[12px] font-normal text-white`}>
                                                {nftData.description}
                                            </Text>
                                            <Text style={tw`text-[12px] font-normal text-white`}>{nftData.date}</Text>
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