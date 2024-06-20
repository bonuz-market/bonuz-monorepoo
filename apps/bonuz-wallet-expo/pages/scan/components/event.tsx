import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import tw from 'twrnc';

import { Tabs } from '@/components/Tabs';
import { Event as EventEntity } from '@/entities/event';

interface EventProps {
  data: Omit<EventEntity, 'checkIns' | 'type'>;
  onCheckOut: () => void;
}

export const Event = ({ data, onCheckOut }: EventProps) => {
  const [activeTab, setActiveTab] = useState<'Details' | 'Quests' | 'Agenda'>('Quests');

  console.log(data, 'data');

  return (
    <View style={tw`flex gap-2`}>
      <Image
        height={170}
        source={{ uri: data.image.url }}
        style={tw`w-full h-[170px] rounded-[30px]`}
      />
      <Tabs tabs={['Details', 'Quests', 'Agenda']} value={activeTab} onValueChange={setActiveTab} />
      {activeTab === 'Details' ? (
        <View style={tw`flex-1 flex-col gap-4`}>
          <View style={tw`flex-1 gap-2`}>
            <Text style={tw`text-white text-xl font-semibold`}>Event Info</Text>
            <View style={tw`flex-col gap-1`}>
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-white text-lg`}>Start Date</Text>
                <Text style={tw`text-white text-base`}>
                  {new Date(data.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Text>
              </View>
              <View style={tw`flex-row gap-2 justify-between`}>
                <Text style={tw`text-white text-lg`}>End Date</Text>
                <Text style={tw`text-white text-base`}>
                  {new Date(data.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-white text-xl font-semibold`}>Description</Text>
            <Markdown
              style={{
                text: {
                  color: 'white',
                },
              }}>
              {data.description}
            </Markdown>
          </View>
          <Pressable
            style={tw`bg-red-600 rounded-[20px] p-2 flex-1 items-center`}
            onPress={onCheckOut}>
            <Text style={tw`text-white text-lg font-semibold`}>Check Out</Text>
          </Pressable>
        </View>
      ) : activeTab === 'Quests' ? (
        <View style={tw`flex-col gap-2`}>
          <Text style={tw`text-white text-xl font-semibold`}>Challenges Info</Text>
          <View style={tw`flex-1 gap-4`}>
            {data.challenges.map((quest, index) => (
              <View key={index} style={tw`bg-[#5242be] rounded-[20px] gap-3 flex-1`}>
                <View style={tw`flex flex-row gap-2 justify-center items-center pr-2`}>
                  <Image
                    style={tw`rounded-[18px]`}
                    height={100}
                    width={100}
                    source={{ uri: quest.image.url }}
                  />
                  <View style={tw`flex-1 flex-row gap-1`}>
                    <Text style={tw`text-[20px] font-semibold text-white`}>{quest.name}</Text>
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
      ) : (
        <></>
      )}
    </View>
  );
};
