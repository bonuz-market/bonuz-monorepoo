import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function ExploreOptionButton(props: {
    index: number;
    value: string;
    clickFlag: number;
    setClickFlag: any;
}) {
    const { index, value, clickFlag, setClickFlag } = props;

    return (
        <TouchableOpacity onPress={() => setClickFlag(index)}>
            <View style={[
                tw`bg-[#4B36AE] flex-row justify-center px-6 py-4 items-center rounded-3xl`,
                index === clickFlag ? tw`bg-white` : tw`bg-[#4B36AE]`,
            ]}>
                <Text
                    style={[
                        tw`text-[16px] font-medium`,
                        index === clickFlag ? tw`text-black` : tw`text-white`,
                    ]}>
                    {value}
                </Text>
            </View>
        </TouchableOpacity >
    );
}
