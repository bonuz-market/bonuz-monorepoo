import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

export default function SwitchButton(props: {
    value: any;
    onValueChange: any;
    title1: string;
    title2: string;
}) {
    const { value, onValueChange, title1, title2 } = props;
    const toggleSwitch = () => {
        const newValue = !value;
        onValueChange(newValue);
    };

    return (
        <Pressable onPress={toggleSwitch}>
            <View style={tw`flex h-[48px] bg-[#413DAB] rounded-[50px] p-1 flex-row`}>
                <View style={[
                    tw`w-1/2 h-full rounded-full justify-center items-center`,
                    value ? tw`bg-transparent` : tw`bg-white`,
                ]}>
                    <Text style={[tw`font-semibold text-[16px]`, value ? tw`text-white` : tw`text-black`]}>
                        {title1}
                    </Text>
                </View>
                <View style={[
                    tw`w-1/2 h-full rounded-full justify-center items-center`,
                    value ? tw`bg-white` : tw`bg-transparent`,
                ]}>
                    <Text style={[tw`font-semibold text-[16px]`, value ? tw`text-black` : tw`text-white`]}>
                        {title2}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
