import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';

export default function LoadingSection() {
    return (
        <View style={tw`bg-transparent flex-row justify-center p-3 mx-5 items-center`}>
            <Text style={tw`text-white text-[30px]`}>Loading...</Text>
        </View>
    );
}
