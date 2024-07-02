import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl } from 'react-native';
import tw from 'twrnc';

import { Tabs } from '@/components/Tabs';
import { Text, View } from '@/components/Themed';
import { SocialIdUser } from '@/entities';
import { ConnectionSheet } from '@/pages/connections/sheets';
import { useUserConnections } from '@/services/blockchain/bonuz/useSocialId';

export default function Connection() {
  const headerHeight = useHeaderHeight();

  const bottomModalRef = useRef<BottomSheetModal>(null);

  const [activeTab, setActiveTab] = useState<'Lens.xyz Feed' | 'My Connections'>('My Connections');
  const { data, isLoading, refetch } = useUserConnections();

  const handleConnectionPress = (data: any) => {
    bottomModalRef.current?.present(data);
  };

  const renderItem = ({ user }: { user: SocialIdUser }) => (
    <Pressable onPress={() => handleConnectionPress(user)}>
      <View style={tw`bg-[#4837AE] p-4 rounded-3xl mt-3`}>
        <View style={tw`bg-transparent flex flex-row justify-between text-center items-center`}>
          <View style={tw`bg-transparent flex flex-row gap-2 justify-center items-center`}>
            <Image
              style={tw`w-16 h-16 rounded-full`}
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : require('@/assets/images/profile/defaultAvatar.jpg')
              }
            />
            <View style={tw`bg-transparent`}>
              <Text style={tw`text-[20px] font-semibold text-white`}>{user.name}</Text>
              <Text style={tw`text-[16px] font-normal text-white`}>@{user.handle}</Text>
            </View>
          </View>
          <Image source={require('@/assets/images/connection/leftUpArrow.png')} />
        </View>
      </View>
    </Pressable>
  );

  return (
    <BottomSheetModalProvider>
      <LinearGradient
        colors={['#4B2EA2', '#0E2875']}
        style={[tw`flex-1`, { paddingTop: headerHeight }]}>
        <View style={tw`bg-transparent mx-5 mt-10`}>
          <Tabs
            tabs={['Lens.xyz Feed', 'My Connections']}
            value={activeTab}
            onValueChange={(tab) => setActiveTab(tab)}
          />
        </View>

        <FlatList
          data={data}
          renderItem={({ item }) => renderItem({ user: item })}
          keyExtractor={(item, index) => item.handle || index.toString()}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          contentContainerStyle={tw`m-5`}
        />
      </LinearGradient>
      <ConnectionSheet ref={bottomModalRef} onRemoveConnection={refetch} snapPoints={['85.5%']} />
    </BottomSheetModalProvider>
  );
}
