import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import { Accordion } from '@/components/Accordion/Accordion';
import { Text } from '@/components/Themed';
import { useBottomTabBarMargin } from '@/hooks/useBottomTabBarHeight';
import { Event } from '@/pages/scan/components/event';
import { ScanQrCode } from '@/pages/scan/sections';
import { getEventsByIds } from '@/services/backend/events.service';
import { useUserStore } from '@/store';

export default function Scan() {
  const tabBarMargin = useBottomTabBarMargin();

  const [activeSections, setActiveSections] = React.useState<number[]>([0]);
  const { checkedInEvents, removeEvent } = useUserStore(
    useShallow((state) => ({
      checkedInEvents: state.events,
      removeEvent: state.removeEvent,
    })),
  );

  console.log(checkedInEvents);

  const { data } = useQuery({
    queryKey: ['eventssssssss', checkedInEvents, checkedInEvents.join('-')],
    queryFn: ({ queryKey }) => getEventsByIds(queryKey[1] as number[]),
  });

  const handleCheckOut = (eventId: number) => {
    removeEvent(eventId);
  };

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

            ...(data ?? []).map((event, index) => ({
              titleComponent: (
                <Text style={tw`text-white text-xl font-semibold`}>{event.title}</Text>
              ),
              renderContent: <Event data={event} onCheckOut={() => handleCheckOut(event.id)} />,
              index: index + 1,
            })),
          ]}
          onAccordionChange={(sections) => setActiveSections(sections)}
        />
        <View style={{ paddingBottom: tabBarMargin }} />
      </View>
    </LinearGradient>
  );
}
