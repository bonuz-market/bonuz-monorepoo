import { BlurView } from 'expo-blur';
import * as Sharing from 'expo-sharing';
import { Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import tw from 'twrnc';

export const ShareButton = ({ route }: { route: { params: { slug: string } } }) => {
  const handleShare = async () => {
    // TODO: add Universal link to handle share
    await Sharing.shareAsync(`https://app.bonuz.id/partner/${route.params.slug}`);
  };

  return (
    <View style={tw`h-[48px] w-[48px] z-50`}>
      <Pressable onPress={handleShare} hitSlop={30} style={tw`absolute`}>
        <BlurView style={[tw`flex-1 p-3 rounded-full overflow-hidden`]} intensity={50} tint="light">
          <Iconify icon="ion:share-outline" color="white" size={24} />
        </BlurView>
      </Pressable>
    </View>
  );
};
