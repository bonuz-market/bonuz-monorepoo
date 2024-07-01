import { useHeaderHeight } from '@react-navigation/elements';
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
import { ConnectedDapps, ScanQrCode } from '@/pages/scan/sections';
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

  const onEventCheckIn = () => {
    const newScannedEventIndex = data?.length ?? 0 - 1;
    setActiveSections([2 + newScannedEventIndex]);
  };

  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={[tw`flex-1 items-center w-full`]}>
      <Accordion
        activeSections={activeSections}
        sections={[
          {
            titleComponent: <Text style={tw`text-white text-xl font-semibold`}>Scan</Text>,
            renderContent: (
              <ScanQrCode isActive={activeSections.includes(0)} onEventCheckIn={onEventCheckIn} />
            ),
            index: 0,
          },
          {
            index: 1,
            renderContent: <ConnectedDapps />,
            titleComponent: (
              <Text style={tw`text-white text-xl font-semibold`}>Connected Dapps</Text>
            ),
          },
          ...(data ?? []).map((event, index) => ({
            titleComponent: <Text style={tw`text-white text-xl font-semibold`}>{event.title}</Text>,
            renderContent: <Event data={event} onCheckOut={() => handleCheckOut(event.id)} />,
            index: index + 2,
          })),
        ]}
        onAccordionChange={(sections) => setActiveSections(sections)}
        contentContainerStyle={{ paddingTop: headerHeight + 16 }}
      />
      <View style={{ paddingBottom: tabBarMargin }} />
    </LinearGradient>
  );
}
