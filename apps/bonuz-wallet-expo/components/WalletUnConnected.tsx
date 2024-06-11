import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import tw from 'twrnc';

export default function WalletUnConnected() {
    return (
        <ScrollView style={tw`mx-5`}>
            <View
                style={tw`bg-transparent flex flex-row items-center justify-between bg-[#373BA1] p-3 rounded-4`}>
                <View style={tw`bg-transparent flex flex-row gap-4`}>
                    <View style={tw`w-[50px] bg-[#2F1385] rounded-2`} />
                    <View style={tw`bg-transparent gap-2`}>
                        <Text style={tw`text-[20px] font-bold text-[#FFFFFF]`}>Login to continue</Text>
                        <Text style={tw`text-[13px] font-normal text-[#FFFFFF]`}>
                            Generate Keyless MFC Wallet
                        </Text>
                    </View>
                </View>
                <View style={tw`bg-transparent`}>
                    <Image source={require('@/assets/images/cart/rightIcon.png')} />
                </View>
            </View>
        </ScrollView>
    );
}
