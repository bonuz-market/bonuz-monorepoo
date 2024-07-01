import { SessionTypes } from '@walletconnect/types';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

import { useWalletConnectSessions } from '@/features/wallet/hooks';

export const ConnectedDapps = () => {
  const { activeSessions, disconnectSession } = useWalletConnectSessions();

  return (
    <FlatList
      data={activeSessions}
      style={tw`flex-1`}
      renderItem={({ item }) => {
        return (
          <View
            style={tw`flex-row justify-between gap-2 px-2 py-3 items-center bg-[#5242be] rounded-[20px]`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <Image
                source={{ uri: item.peer.metadata.icons[0] }}
                style={tw`w-10 h-10 rounded-full`}
              />
              <View style={tw`flex-col`}>
                <Text style={tw`text-white`}>{item.peer.metadata.name}</Text>
                <Text style={tw`text-white text-opacity-70`}>{item.peer.metadata.url}</Text>
              </View>
            </View>
            <Pressable
              style={tw`bg-red-500 p-2 rounded`}
              onPress={() => disconnectSession(item as SessionTypes.Struct)}>
              <Text style={tw`text-white`}>Disconnect</Text>
            </Pressable>
          </View>
        );
      }}
      ItemSeparatorComponent={() => <View style={tw`h-2`} />}
    />
  );
};
