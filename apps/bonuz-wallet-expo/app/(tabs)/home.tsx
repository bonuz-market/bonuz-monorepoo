import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import { HomeBanner } from '@/components/HomeBanner/HomeBanner';
import HomeCarousel from '@/components/HomeCarousel';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import { Tabs } from '@/components/Tabs';
import { Text, View } from '@/components/Themed';
import { App, Partner } from '@/entities/discovery';
import { useBottomTabBarMargin } from '@/hooks/useBottomTabBarHeight';
import { BACKEND_ENDPOINT } from '@/services/backend/backend.config';
import {
  getDigitalWorldData,
  getFeaturedItems,
  getRealWorldData,
} from '@/services/backend/discovery.service';

export default function Home() {
  const tabBarMargin = useBottomTabBarMargin();
  const { navigate } = useRouter();

  const { data: featuredItems } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: getFeaturedItems,
  });

  const { data: realWorldData } = useQuery({
    queryKey: ['realWorldData'],
    queryFn: async () => getRealWorldData(),
    select: (data) => {
      return data.docs.map((item) => ({
        ...item,
        partners: item.items.map((partner) => ({
          ...partner,
          image: {
            url: `${BACKEND_ENDPOINT}${partner.image?.url}`,
          },
        })),
      }));
    },
  });

  const { data: digitalWorldData } = useQuery({
    queryKey: ['digitalWorldData'],
    queryFn: async () => getDigitalWorldData(),
    select: (data) => {
      return data.docs.map((item) => ({
        ...item,
        apps: item.items.map((app) => ({
          ...app,
          image: {
            url: `${BACKEND_ENDPOINT}${app.image?.url}`,
          },
        })),
      }));
    },
  });

  const realWorldDataByCategory = realWorldData?.reduce(
    (acc, item) => {
      acc[item.title] = item.partners;
      return acc;
    },
    {} as Record<string, Partner[]>,
  );

  const digitalWorldDataByCategory = digitalWorldData?.reduce(
    (acc, item) => {
      acc[item.title] = item.apps;
      return acc;
    },
    {} as Record<string, App[]>,
  );

  const [activeTab, setActiveTab] = useState<'Real World' | 'Digital World'>('Digital World');

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1 flex-col gap-1.5`}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
          { paddingTop: StatusBarHeight() },
        ]}>
        <TouchableOpacity onPress={() => navigate('/connection')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <View
              style={tw`bg-[#FF3B30] absolute top-[-1] left-9 w-[20px] rounded-full justify-center items-center`}>
              <Text style={tw`text-[12px] text-white font-semibold`}>7</Text>
            </View>
            <Image
              style={tw`w-[30px] h-[30px]`}
              source={require('@/assets/images/home/profile.png')}
            />
          </View>
        </TouchableOpacity>
        <Image style={tw`w-33 h-9`} source={require('@/assets/images/home/logo.png')} />
        <TouchableOpacity onPress={() => navigate('/wallet')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image
              style={tw`w-[30px] h-[30px]`}
              source={require('@/assets/images/home/cart.png')}
            />
          </View>
        </TouchableOpacity>
      </View>

      <HomeBanner data={featuredItems ?? []} />
      <Tabs
        tabs={['Digital World', 'Real World']}
        value={activeTab}
        onValueChange={(tab) => setActiveTab(tab as 'Real World' | 'Digital World')}
        containerStyle={tw`mx-4 bg-[#684FCD]`}
      />

      <View style={tw`flex flex-row items-center bg-transparent mx-4 justify-between`}>
        <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
          <Image
            style={tw`w-[30px] h-[30px]`}
            source={require('@/assets/images/home/filter.png')}
          />
        </View>

        <View
          style={tw`py-2 flex flex-row items-center bg-[#5F42BE] w-83 h-12 rounded-full border-2 border-[#7651CD]`}>
          <Image style={tw`w-7 h-7 mr-2`} source={require('@/assets/images/home/search.png')} />
          <TextInput
            placeholderTextColor={'#BAB3E2'}
            placeholder="Search events, shops, communities..."
            style={tw`text-[16px] font-normal text-white w-80`}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[{ paddingBottom: tabBarMargin }, tw`gap-3`]}
        style={tw`px-4 mt-1`}>
        {activeTab === 'Real World'
          ? Object.entries(realWorldDataByCategory ?? {}).map(([category, partners]) => (
            <HomeCarousel
              key={category}
              title={category}
              badgeCount={partners.length}
              right={
                <Link
                  href={{
                    pathname: '/(discover)/realWorld/[category]',
                    params: { category },
                  }}>
                  <Text style={tw`text-white text-sm font-semibold`}>View All</Text>
                </Link>
              }
              data={partners.slice(0, 3).map((partner) => ({
                title: partner.name,
                image: partner.image.url,
                href: {
                  pathname: '/(discover)/realWorld/partner/[slug]',
                  params: { slug: partner.id },
                },
              }))}
            />
          ))
          : Object.entries(digitalWorldDataByCategory ?? {}).map(([category, apps]) => (
            <HomeCarousel
              key={category}
              title={category}
              badgeCount={apps.length}
              right={
                <View style={tw`px-3 py-1 bg-[#684FCD] rounded-full`}>
                  <Link
                    href={{
                      pathname: '/(discover)/digitalWorld/[category]',
                      params: { category },
                    }}>
                    <Text style={tw`text-white text-sm font-semibold`}>View All</Text>
                  </Link>
                </View>
              }
              data={apps.slice(0, 3).map((app) => ({
                title: app.name,
                image: app.image.url,
                href: {
                  pathname: '/home',
                },
              }))}
            />
          ))}
      </ScrollView>
    </LinearGradient>
  );
}
