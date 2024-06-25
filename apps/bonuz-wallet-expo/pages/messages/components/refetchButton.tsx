import { useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

export const RefetchMessagesHeaderButton = () => {
  const queryClient = useQueryClient();
  const refetchMessages = async () => {
    await queryClient.refetchQueries({ queryKey: ['messages'] });
  };

  return (
    <View style={tw`h-[48px] w-[48px] z-50`}>
      <Pressable onPress={refetchMessages} hitSlop={30} style={tw`absolute`}>
        <BlurView style={[tw`flex-1 p-3 rounded-full overflow-hidden`]} intensity={50} tint="light">
          <Iconify icon="ep:refresh" color="white" size={24} />
        </BlurView>
      </Pressable>
    </View>
  );
};
