import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { Accordion } from '@/components/Accordion/Accordion';
import { Text } from '@/components/Themed';
import { ScanQrCode } from '@/pages/scan/sections';

export default function Scan() {
  const [activeSections, setActiveSections] = React.useState<number[]>([0]);
  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1 items-center w-full`}>
      <View style={tw`w-full mt-4`}>
        <Accordion
          activeSections={activeSections}
          sections={[
            {
              titleComponent: <Text style={tw`text-white text-xl font-semibold`}>Scan</Text>,
              renderContent: <ScanQrCode isActive={activeSections.includes(0)} />,
              index: 0,
            },
            {
              titleComponent: <Text style={tw`text-white text-xl font-semibold`}>Section 1</Text>,
              renderContent: (
                <Text style={tw`text-white text-lg`}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                </Text>
              ),
              index: 1,
            },
          ]}
          onAccordionChange={(sections) => setActiveSections(sections)}
        />
      </View>
    </LinearGradient>
  );
}
