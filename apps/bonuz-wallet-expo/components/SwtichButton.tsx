import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

export default function SwitchButton(props: {
    value: string;
    onValueChange: any;
    titleList: string[];
}) {
    const { value, onValueChange, titleList } = props;
    const toggleSwitch = (title: string) => {
        onValueChange(title);
    };

    return (
        <View style={tw`flex h-[48px] bg-[#413DAB] rounded-[50px] p-1 flex-row`}>
            {titleList.map((title: string, index: number) => (
                <Pressable
                    key={index}
                    onPress={() => toggleSwitch(title)}
                    style={[
                        tw`h-full rounded-full justify-center items-center`,
                        { width: `${100 / titleList.length}%` },
                        value !== title ? tw`bg-transparent` : tw`bg-white`,
                    ]}>
                    <Text style={[tw`font-semibold text-[16px]`, value !== title ? tw`text-white` : tw`text-black`]}>
                        {title}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
