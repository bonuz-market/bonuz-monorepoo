import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

interface walletProps {
    id: number;
    name: string;
    walletIcon: any;
}
export default function WalletTypesSection(props: {
    walletTypes: walletProps[];
    setWalletType: any;
    dismissModal: any;
}) {
    const { walletTypes, setWalletType, dismissModal } = props;

    const toggleSwitch = (types: string) => {
        setWalletType(types);
    };

    return (
        <View style={tw`bg-transparent p-3`}>
            {walletTypes.map((value: walletProps, index: number) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        toggleSwitch(value.name);
                        dismissModal();
                    }}
                >
                    <View style={tw`flex bg-[#3835A6] p-5 rounded-3xl mb-5`}>
                        <Text style={tw`text-white text-[20px]`}>{value.name}</Text>
                    </View>
                </TouchableOpacity>
            ))
            }
        </View >
    );
}
