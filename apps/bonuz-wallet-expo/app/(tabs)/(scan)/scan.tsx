import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { Accordion } from '@/components/Accordion/Accordion';
import { Text } from '@/components/Themed';
import { Event } from '@/pages/scan/components/event';
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
              index: 1,
              titleComponent: (
                <Text style={tw`text-white text-xl font-semibold`}>ArtsDAOFest 2025</Text>
              ),
              renderContent: (
                <Event
                  data={{
                    title: 'ArtsDAOFest 2025',
                    description:
                      'Thanks to the enormous success of **WCD Pool Sessions** at the beginning of September, Frankfurt-based event specialist **BigCityBeats** inspired hope throughout Germany’s event and festival industry, providing with it a renewed sense of optimism',
                    agenda:
                      'Thanks to the enormous success of **WCD Pool Sessions** at the beginning of September, Frankfurt-based event specialist **BigCityBeats** inspired hope throughout Germany’s event and festival industry, providing with it a renewed sense of optimism',
                    image: {
                      url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    },
                    startDate: new Date(),
                    endDate: new Date(),
                    quests: [
                      {
                        title: 'Quest 1',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
                        image: {
                          url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        },
                        isPending: true,
                        verification: '{}',
                      },
                      {
                        title: 'Quest 2',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
                        image: {
                          url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        },
                        isPending: false,
                        verification: '{}',
                      },
                    ],
                  }}
                />
              ),
            },
            {
              titleComponent: <Text style={tw`text-white text-xl font-semibold`}>Section 1</Text>,
              renderContent: (
                <Text style={tw`text-white text-lg`}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                </Text>
              ),
              index: 2,
            },
          ]}
          onAccordionChange={(sections) => setActiveSections(sections)}
        />
      </View>
    </LinearGradient>
  );
}
