import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import Markdown from 'react-native-markdown-display';
import tw from 'twrnc';

import { BACKEND_ENDPOINT } from '@/services/backend/backend.config';
import { getRealWorldItemById } from '@/services/backend/discovery.service';

const RealWorldItem = () => {
  const { slug } = useLocalSearchParams();
  console.log(slug, 'slug');

  const { data, isLoading } = useQuery({
    queryKey: ['realWorldItem', slug],
    queryFn: async ({ queryKey }) => getRealWorldItemById(Number(queryKey[1])),
    select: (data) => ({
      ...data,
      image: {
        url: `${BACKEND_ENDPOINT}${data.image.url}`,
      },
    }),
  });

  console.log(data, 'data');
  return (
    <LinearGradient
      colors={['#0E2875', '#4B2EA2']}
      start={[0, 1]}
      end={[1, 1]}
      style={tw`justify-center flex-1 relative`}>
      <ScrollView contentContainerStyle={tw`flex-1`}>
        {!isLoading && data ? (
          <>
            <Image source={{ uri: data.image.url }} style={tw`w-full h-[280px]`} />
            <BlurView
              style={tw`w-full h-full bg-transparent flex-col gap-3 pt-6 pb-3 -top-10 rounded-t-[30px] overflow-hidden`}
              intensity={50}
              tint="dark">
              <View style={tw`px-4`}>
                <View style={tw`flex-row w-full justify-between items-center`}>
                  <View style={tw`flex-col gap-2`}>
                    <Text style={tw`text-white text-2xl font-semibold`}>{data.name}</Text>
                    {/* <Text style={tw`text-white opacity-80 text-base`}>TODO: DATE</Text> */}
                  </View>
                  <BlurView
                    style={tw`rounded-full overflow-hidden items-center justify-center`}
                    intensity={50}
                    tint="light">
                    <Pressable
                      style={tw`rounded-[20px] bg-[#2f0d42] p-3 items-center`}
                      onPress={() => {}}>
                      <Iconify icon="ph:link-thin" color="white" size={30} />
                    </Pressable>
                  </BlurView>
                </View>
              </View>

              <View style={tw`flex-col gap-2 px-4`}>
                <Text style={tw`text-white text-xl`}>Description</Text>
                <Markdown
                  style={{
                    text: {
                      color: 'white',
                      fontSize: 16,
                      opacity: 0.8,
                    },
                  }}>
                  {data.description}
                </Markdown>
              </View>
            </BlurView>
          </>
        ) : (
          <ActivityIndicator size={'large'} style={tw`top-15`} />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default RealWorldItem;
