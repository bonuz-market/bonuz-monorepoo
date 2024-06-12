import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import LoadingSection from './LoadingSection';
import NoItemSection from './NoItemSection';

interface ExploreDataProps {
    id: number;
    title: string;
    description: string;
    image_url: any;
    type: string;
}

export default function ExploreInfoSection(props: { value: any; loadingStatus: boolean }) {
    const { value, loadingStatus } = props;

    return (
        <>
            {loadingStatus === true ? (
                <LoadingSection />
            ) : (
                <>
                    {value.length > 0 ? (
                        value.map((exploreData: ExploreDataProps, index: number) => (
                            <View
                                key={index}
                                style={tw`bg-transparent flex-row justify-between p-3 mx-5 mt-3 mb-3 bg-[#5740B9] rounded-xl`}>
                                <TouchableOpacity onPress={() => console.log('cliekd')}>
                                    <View style={tw`bg-transparent flex flex-row items-center flex-1 gap-4`}>
                                        <Image style={tw`w-[80px] h-[80px]`} source={exploreData.image_url} />
                                        <View style={tw`bg-transparent flex flex-col w-60 gap-2`}>
                                            <Text style={tw`text-[20px] text-white font-semibold flex-wrap`}>
                                                {exploreData.title}
                                            </Text>
                                            <Text style={tw`text-[13px] font-medium text-white`}>
                                                {exploreData.description}
                                            </Text>
                                        </View>
                                        <Image
                                            style={tw`w-[34px] h-[34px]`}
                                            source={require('@/assets/images/explore/rightIcon.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
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
