import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

export const MessagesButton = () => {
  return (
    <Link href="/messages" asChild>
      <Pressable style={tw`relative`}>
        <View
          style={tw`bg-[#FF3B30] absolute top-[-1] z-30 left-8 px-1 py-0.5 rounded-full justify-center items-center`}>
          <Text style={tw`text-[13px] text-white font-semibold`}>3</Text>
        </View>
        <BlurView style={[tw`flex-1 p-3 rounded-full overflow-hidden`]} intensity={50} tint="light">
          <Iconify icon="mynaui:message" color="white" size={24} />
        </BlurView>
      </Pressable>
    </Link>
  );
};
