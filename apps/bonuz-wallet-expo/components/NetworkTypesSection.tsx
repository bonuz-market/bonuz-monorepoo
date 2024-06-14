import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

interface networkProps {
    id: number;
    network: string;
    chainId: string;
}
export default function NetworkTypesSection(props: {
    networkTypes: networkProps[];
    setNetworkType: any;
    dismissModal: any;
}) {
    const { networkTypes, setNetworkType, dismissModal } = props;

    const toggleSwitch = (types: number) => {
        setNetworkType(types);
    };

    return (
        <View style={tw`bg-transparent p-3`}>
            {networkTypes.map((value: networkProps, index: number) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        toggleSwitch(index);
                        dismissModal();
                    }}
                >
                    <View style={tw`flex bg-[#3835A6] p-5 rounded-3xl mb-5`}>
                        <Text style={tw`text-white text-[20px]`}>{value.network}</Text>
                    </View>
                </TouchableOpacity>
            ))
            }
        </View >
    );
}
