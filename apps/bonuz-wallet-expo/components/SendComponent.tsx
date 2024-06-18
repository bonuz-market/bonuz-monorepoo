/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';


export default function SendComponent(props: { handleDismissModalPress: any; }) {
    const { handleDismissModalPress } = props;

    return (
        <View style={tw`flex-1 my-5 mx-10 gap-6`}>
            <View style={tw`flex gap-2`}>
                <Text style={tw`text-[16px] text-white`}>Enter wallet address</Text>
                <TextInput
                    placeholderTextColor={'#BAB3E2'}
                    placeholder=""
                    style={tw`text-[16px] font-normal text-white px-2 bg-[#040D5C] rounded-md w-full h-[40px]`}
                />
            </View>
            <View style={tw`flex gap-2`}>
                <Text style={tw`text-[16px] text-white`}>Network</Text>
                <TextInput
                    placeholderTextColor={'#BAB3E2'}
                    placeholder="Polygon"
                    style={tw`text-[16px] font-normal text-white px-2 bg-[#040D5C] rounded-md w-full h-[40px]`}
                />
            </View>
            <View style={tw`flex gap-2`}>
                <Text style={tw`text-[16px] text-white`}>Amount</Text>
                <View style={tw`px-2 bg-[#040D5C] rounded-md w-full h-[40px] flex flex-row justify-between items-center`}>
                    <TextInput
                        placeholderTextColor={'#BAB3E2'}
                        placeholder="0"
                        style={tw`text-[16px] font-normal text-white px-2 bg-[#040D5C] rounded-md w-9/10 h-[40px]`}
                    />
                    <TouchableOpacity onPress={() => console.log('sdf')}>
                        <Text style={tw`text-[16px] text-white font-normal text-right`}>MAX</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={tw`w-full bg-[#4A2EA1] w-full h-[2px]`} />
            <View style={tw`flex gap-2`}>
                <Text style={tw`text-white text-[15px]`}>Amount to send:</Text>
                <Text style={tw`text-white text-[15px]`}>Gas Fee:</Text>
                <Text style={tw`text-white text-[15px]`}>Gas Estimates:</Text>
            </View>
        </View>
    );
}
