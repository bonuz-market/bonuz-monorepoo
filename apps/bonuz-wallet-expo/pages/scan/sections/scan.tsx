import { useIsFocused } from '@react-navigation/native';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import tw from 'twrnc';

import { Tabs } from '@/components/Tabs';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

const QRCODE_BASE_URL = 'https://app.bonuz.xyz/users';
export const ScanQrCode = ({ isActive }: { isActive: boolean }) => {
  const [activeTab, setActiveTab] = useState<'My QR Code' | 'Scan'>('My QR Code');
  const user = useUserStore((state) => state.user);

  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const handleBarcodeScanned = (scanResult: BarcodeScanningResult) => {
    console.log(scanResult.data);
    setActiveTab('My QR Code');
  };

  useEffect(() => {
    return () => {
      setActiveTab('My QR Code');
    };
  }, [isFocused]);

  if (!isNotEmpty(user)) {
    // TODO: Add logged out state
    return null;
  }

  if (!permission || !isFocused) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={tw`flex flex-col items-center gap-6 mb-8`}>
      <Tabs
        tabs={['My QR Code', 'Scan']}
        value={activeTab}
        onValueChange={(tab) => setActiveTab(tab)}
      />
      {activeTab === 'My QR Code' ? (
        <View style={tw`flex items-center w-[289px] h-[274px]`}>
          <View style={tw`rounded-xl overflow-hidden`}>
            <QRCode value={`${QRCODE_BASE_URL}/${user.handle}`} size={250} quietZone={20} />
          </View>
        </View>
      ) : (
        <View>
          <ImageBackground
            source={require('@/assets/images/scanBorder.png')}
            style={tw`w-[289px] h-[274px] flex justify-center items-center rounded-2xl`}>
            {isActive && (
              <CameraView
                style={tw`w-[250px] h-[250px] rounded-2xl overflow-hidden`}
                onBarcodeScanned={handleBarcodeScanned}
              />
            )}
          </ImageBackground>
        </View>
      )}

      <Text style={tw`text-white text-base opacity-60`}>or</Text>
      <Text style={tw`text-white text-base opacity-60`}>Use NFC</Text>
    </View>
  );
};
