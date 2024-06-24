/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable sonarjs/no-all-duplicated-branches */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import ExploreInfoSection from '@/components/ExploreIitem';
import ExploreOptionButton from '@/components/ExploreOptionButton';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import { View } from '@/components/Themed';

const option = ['Featured', 'DeFi', 'Gift Cards', 'My Favourites'];

interface exploreDataProps {
  id: number;
  title: string;
  description: string;
  image_url: string;
  type: string;
}
const exploreMockUpData = [
  {
    id: 1,
    title: '1inch',
    description: 'Swap tokens with the most liquidity',
    image_url: require('@/assets/images/explore/Event.png'),
    type: 'DeFi',
  },
  {
    id: 2,
    title: 'Uniswap',
    description: 'Swap tokens and earn fees through po...',
    image_url: require('@/assets/images/explore/Event1.png'),
    type: 'DeFi',
  },
  {
    id: 3,
    title: 'Uniswap',
    description: 'Swap and earn with the community-dr...',
    image_url: require('@/assets/images/explore/Event2.png'),
    type: 'DeFi',
  },
  {
    id: 4,
    title: 'DODO',
    description: 'Swap and earn with the proactive mar...',
    image_url: require('@/assets/images/explore/Event3.png'),
    type: 'Gift Cards',
  },
  {
    id: 5,
    title: 'Balancer',
    description: 'Create liqudity pools and swap tokens',
    image_url: require('@/assets/images/explore/Event4.png'),
    type: 'Gift Cards',
  },
  {
    id: 6,
    title: 'QuestN',
    description: 'Complete quests and get rewards',
    image_url: require('@/assets/images/explore/Event5.png'),
    type: 'My Favourites',
  },
  {
    id: 7,
    title: 'Swat Economy',
    description: 'Walk into crypto',
    image_url: require('@/assets/images/explore/Event6.png'),
    type: 'My Favourites',
  },
];
export default function Explore() {
  const { navigate } = useRouter();
  const [clickFlag, setClickFlag] = useState<number>(1);
  const [filteredExploredata, setFilteredExploreData] =
    useState<exploreDataProps[]>(exploreMockUpData);

  useEffect(() => {
    const selectedOption = option[clickFlag - 1];
    setFilteredExploreData(exploreMockUpData.filter((item) => item.type === selectedOption));
  }, [clickFlag, exploreMockUpData]);

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
          { paddingTop: StatusBarHeight() },
        ]}>
        <TouchableOpacity onPress={() => navigate('/wallet')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/explore/leftIcon.png')} />
          </View>
        </TouchableOpacity>
        <View style={tw`py-2 flex flex-row items-center bg-[#5F42BE] w-70 h-12 rounded-full`}>
          <Image
            style={tw`w-7 h-7 mr-2 ml-2`}
            source={require('@/assets/images/home/search.png')}
          />
          <TextInput
            placeholderTextColor={'#BAB3E2'}
            placeholder="Search URL"
            style={tw`text-[16px] font-normal text-white w-80`}
          />
        </View>
        <TouchableOpacity onPress={() => navigate('/explore')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/explore/rightIcon.png')} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1 mt-5 bg-transparent mx-5`}>
        <ScrollView
          horizontal
          contentContainerStyle={{
            display: 'flex',
            gap: 20,
            flexDirection: 'row',
          }}>
          {option.map((data: any, index: number) => (
            <ExploreOptionButton
              key={index}
              index={index + 1}
              value={data}
              clickFlag={clickFlag}
              setClickFlag={setClickFlag}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView style={tw`bg-transparent flex-1 mt-[-500px]`}>
        <ExploreInfoSection value={filteredExploredata} loadingStatus={false} />
      </ScrollView>
    </LinearGradient>
  );
}
