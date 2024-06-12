import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import tw from 'twrnc';

import { Text } from '@/components/Themed';

export default function Scan() {
  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-white text-2xl font-bold`}>Scan QR</Text>
    </LinearGradient>
  );
}
