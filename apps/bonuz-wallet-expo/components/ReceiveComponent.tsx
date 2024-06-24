/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-qr-code';
import tw from 'twrnc';

export default function ReceiveComponent(props: {
  handleDismissModalPress: any;
  walletAddress: string;
}) {
  const { handleDismissModalPress, walletAddress } = props;

  const handleAddressCopy = useCallback(async (address: string) => {
    console.log('copy clicked');
    await Clipboard.setStringAsync(address);
  }, []);

  return (
    <View style={tw`bg-transparent flex-1 justify-center items-center py-5`}>
      <View style={tw`bg-transparent w-[350px]`}>
        <Text style={tw`text-[#BBACD5] text-[18px] text-center font-semibold`}>
          Deposit/Send to this address
        </Text>
        <View style={tw`w-full items-center justify-center`}>
          <View style={tw`justify-center items-center mt-2 bg-white p-2 w-[220px] rounded-xl`}>
            <QRCode
              size={200}
              style={tw`h-auto w-full`}
              value={walletAddress}
              viewBox={`0 0 256 256`}
            />
          </View>
        </View>
        <View style={tw`bg-transparent flex mt-5`}>
          <Text style={tw`text-[16px] text-[#BBACD5]`}>Deposit Address</Text>
          <View style={tw`bg-transparent flex flex-row justify-between items-center mt-2`}>
            <Text style={tw`flex flex-wrap w-[250px] text-white font-semibold`}>
              {walletAddress}
            </Text>
            <Pressable
              onPress={() => {
                handleAddressCopy(walletAddress);
              }}
              hitSlop={30}>
              <Ionicons name="copy-outline" size={20} color="white" style={tw`opacity-70`} />
            </Pressable>
          </View>
        </View>
        <View style={tw`w-full bg-[#FFFFFF] w-full h-[1px] mt-10`} />
        <TouchableOpacity
          onPress={() => {
            handleDismissModalPress();
          }}>
          <LinearGradient
            colors={['#EB722E', '#F224A6']}
            style={tw`bg-transparent mt-10 p-3 justify-center items-center rounded-md`}>
            <Text style={tw`text-white text-[16px]`}>Save Image</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
