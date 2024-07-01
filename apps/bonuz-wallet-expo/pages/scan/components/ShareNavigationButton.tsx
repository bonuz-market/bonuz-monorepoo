import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';

import { Wallet } from '@/entities';
import { useUserStore } from '@/store';

const BASE_URL = 'https://app.bonuz.xyz';

export const ShareNavigationButton = () => {
  const address = useUserStore((state) => (state.wallet as Wallet).address);
  const base64QrCodeRef = useRef<string>();

  const openShareDialogAsync = async () => {
    const shareOptions = {
      mimeType: 'image/jpeg',
      dialogTitle: 'Add me on Bonuz!',
      UTI: 'image/jpeg',
    } satisfies Sharing.SharingOptions;

    if (!(await Sharing.isAvailableAsync())) {
      Toast.show({
        text1: 'Your device does not allow sharing',
      });
      return;
    }

    const imgBase64 = base64QrCodeRef.current;

    console.log('dataUrl', imgBase64);

    const uri = FileSystem.cacheDirectory + address + '.jpg';
    await FileSystem.writeAsStringAsync(uri, imgBase64!, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, shareOptions);
  };

  return (
    <View style={tw`h-[48px] w-[48px] z-50`}>
      <Pressable onPress={openShareDialogAsync} hitSlop={30} style={tw`absolute`}>
        <BlurView style={[tw`flex-1 p-3 rounded-full overflow-hidden`]} intensity={50} tint="light">
          <Iconify icon="ion:share-outline" color="white" size={24} />
        </BlurView>
        <View style={tw`absolute top-0 left-0 right-0 bottom-0 bg-white opacity-0`}>
          <QRCode
            value={`${BASE_URL}/users/${address}`}
            size={250}
            quietZone={20}
            getRef={(c) => {
              if (!c?.toDataURL) return;

              c?.toDataURL((base64Image: string) => {
                // must strip whitespace due to 'bug' in QR code library
                // see https://github.com/react-native-share/react-native-share/issues/1393#issuecomment-1568365217
                base64QrCodeRef.current = base64Image?.replaceAll(/(\r\n|\n|\r)/gm, '');
              });
            }}
          />
        </View>
      </Pressable>
    </View>
  );
};
