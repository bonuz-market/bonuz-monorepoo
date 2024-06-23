import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import SwitchButton from '@/components/SwtichButton';
import { Tabs } from '@/components/Tabs';
import { Text, View } from '@/components/Themed';
import { ConnectionSheet } from '@/pages/connections/sheets';
import { useUserConnections } from '@/services/blockchain/bonuz/useSocialId';

export default function Connection() {
  const { navigate } = useRouter();

  const bottomModalRef = useRef<BottomSheetModal>(null);

  const [activeTab, setActiveTab] = useState<'Lens.xys Feed' | 'My Connections'>('My Connections');
  const { data, isLoading, refetch } = useUserConnections();

  console.log(data, 'data connections');

  // const [isEnabled, setEnabled] = useState(false);

  const handleConnectionPress = (data: any) => {
    console.log(data, 'data');

    bottomModalRef.current?.present(data);
  };

  return (
    <BottomSheetModalProvider>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
        <StatusBar backgroundColor={'#5137B1'} />
        <View
          style={[
            tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
            { paddingTop: StatusBarHeight() },
          ]}>
          <TouchableOpacity onPress={() => navigate('/home')}>
            <View
              style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
              <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
            </View>
          </TouchableOpacity>
          <View style={tw`flex bg-transparent justify-center items-center`}>
            <Text style={tw`text-[20px] text-white font-semibold`}>Social</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('/messages')}>
            <View
              style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
              <View
                style={tw`bg-[#FF3B30] absolute top-[-1] left-9 w-[20px] rounded-full justify-center items-center`}>
                <Text style={tw`text-[13px] text-white font-semibold`}>3</Text>
              </View>
              <Image
                style={tw`w-[30px]`}
                source={require('@/assets/images/connection/messageIcon.png')}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={tw`bg-transparent mx-5 mt-10`}>
          <Tabs
            tabs={['Lens.xys Feed', 'My Connections']}
            value={activeTab}
            onValueChange={(tab) => setActiveTab(tab)}
          />
        </View>

        <ScrollView
          style={tw`bg-transparent m-5`}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
          {data?.map((user, index) => (
            <Pressable onPress={() => handleConnectionPress(user)} key={user.handle || index}>
              <View style={tw`bg-[#4837AE] p-4 rounded-3xl mt-3`}>
                <StatusBar backgroundColor={'#5137B1'} />
                <View
                  style={tw`bg-transparent flex flex-row justify-between text-center items-center`}>
                  <View style={tw`bg-transparent flex flex-row gap-2 justify-center items-center`}>
                    <Image
                      style={tw`w-16 h-16 rounded-full`}
                      source={{ uri: user.profilePicture! }}
                    />
                    <View style={tw`bg-transparent`}>
                      <Text style={tw`text-[20px] font-semibold text-white`}>{user.name}</Text>
                      <Text style={tw`text-[16px] font-normal text-white`}>{user.handle}</Text>
                    </View>
                  </View>
                  <View style={tw`bg-transparent`}>
                    <Image source={require('@/assets/images/connection/leftUpArrow.png')} />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>
      <ConnectionSheet ref={bottomModalRef} onRemoveConnection={refetch} />
    </BottomSheetModalProvider>
  );
}
