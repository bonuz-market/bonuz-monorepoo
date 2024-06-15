import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import tw from 'twrnc';

import { Tabs } from '@/components/Tabs';
import { Event as EventEntity } from '@/entities/event';

interface EventProps {
  data: Omit<EventEntity, 'checkIns' | 'type'>;
}

export const Event = ({ data }: EventProps) => {
  const [activeTab, setActiveTab] = useState<'Details' | 'Quests' | 'Agenda'>('Quests');
  return (
    <View style={tw`flex gap-2`}>
      <Image
        height={116}
        source={{ uri: data.image.url }}
        style={tw`w-full h-[116px] rounded-[30px]`}
      />
      <Tabs tabs={['Details', 'Quests', 'Agenda']} value={activeTab} onValueChange={setActiveTab} />
      {activeTab === 'Details' ? (
        <Markdown
          style={{
            text: {
              color: 'white',
            },
          }}>
          {data.description}
        </Markdown>
      ) : activeTab === 'Quests' ? (
        <View style={tw`flex-col gap-2`}>
          <Text style={tw`text-white text-xl font-semibold`}>Challenges Info</Text>
          <View style={tw`flex-1 gap-4`}>
            {data.quests.map((quest, index) => (
              <View key={index} style={tw`bg-[#5242be] rounded-[20px] gap-3 flex-1`}>
                <View style={tw`flex flex-row gap-2 justify-center items-center pr-2`}>
                  <Image
                    style={tw`rounded-[18px]`}
                    height={100}
                    width={100}
                    source={{ uri: quest.image.url }}
                  />
                  <View style={tw`flex-1 flex-row gap-1`}>
                    <Text style={tw`text-[20px] font-semibold text-white`}>{quest.title}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : activeTab === 'Agenda' ? (
        <View>
          <Markdown
            style={{
              text: {
                color: 'white',
              },
            }}>
            {data.agenda}
          </Markdown>
        </View>
      ) : null}
    </View>
  );
};
