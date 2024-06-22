import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

import { BACKEND_ENDPOINT } from '@/services/backend/backend.config';
import { getRealWorldData } from '@/services/backend/discovery.service';

const RealWorldList = () => {
  const { category } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: category,
    });
  }, [category, navigation]);

  console.log(category, 'category');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['realWorldData', category],
    queryFn: async ({ queryKey }) => getRealWorldData(queryKey[1] as string),
    select: (data) =>
      data.docs.map((item) => ({
        ...item,
        partners: item.items.map((partner) => ({
          ...partner,
          image: {
            url: `${BACKEND_ENDPOINT}${partner.image.url}`,
          },
        })),
      }))[0],
  });

  return (
    <LinearGradient
      colors={['#0E2875', '#4B2EA2']}
      start={[0, 1]}
      end={[1, 1]}
      style={tw`w-full h-full justify-center`}>
      <FlatList
        data={data?.partners}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: `/(discover)/realWorld/partner/[slug]`,
              params: { slug: item.id },
            }}
            asChild>
            <Pressable>
              <ImageBackground
                style={tw`w-full  h-[170px] rounded-[20px] justify-end`}
                imageStyle={tw`rounded-[20px]`}
                height={170}
                source={{ uri: item.image.url }}>
                <Text style={tw`text-xl text-white font-semibold p-4`}>{item.name}</Text>
              </ImageBackground>
            </Pressable>
          </Link>
        )}
        contentContainerStyle={tw`p-4`}
        ItemSeparatorComponent={() => <View style={tw`h-4`} />}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={() => {
          return isLoading && <ActivityIndicator />;
        }}
      />
    </LinearGradient>
  );
};

export default RealWorldList;
