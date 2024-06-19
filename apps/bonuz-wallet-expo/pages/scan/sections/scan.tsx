import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, ImageBackground, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import tw from 'twrnc';

import { Tabs } from '@/components/Tabs';
import { getEventById } from '@/services/backend/events.service';
import { useQueryGetUserProfileAndSocialLinksByHandle } from '@/services/blockchain/bonuz/useSocialId';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

import { EventSheet } from '../sheets/event';
import { UserSheet } from '../sheets/user';

const QRCODE_BASE_URL = 'https://app.bonuz.xyz';
export const ScanQrCode = ({ isActive }: { isActive: boolean }) => {
  const [activeTab, setActiveTab] = useState<'My QR Code' | 'Scan'>('My QR Code');
  const { user, addEvent } = useUserStore((state) => ({
    user: state.user,
    addEvent: state.addEvent,
  }));

  const [scannedUserHandle, setScannedUserHandle] = useState<string>();
  const [eventId, setEventId] = useState<number>();

  const { data, refetch } = useQueryGetUserProfileAndSocialLinksByHandle({
    handle: scannedUserHandle,
  });

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: ({ queryKey }) => getEventById(queryKey[1] as number),
    enabled: !!eventId,
  });

  const userBottomModalRef = useRef<BottomSheetModal>(null);
  const eventBottomModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (data && scannedUserHandle) {
      userBottomModalRef.current?.present(data);
    }

    if (eventId && event) {
      eventBottomModalRef.current?.present(event);
    }
  }, [data, event, eventId, scannedUserHandle]);

  const handleRemoveConnection = async () => {
    await refetch();
  };

  const handleAddConnection = async () => {
    await refetch();
  };

  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const handleBarcodeScanned = (scanResult: BarcodeScanningResult) => {
    console.log(scanResult.data);

    if (scanResult.data.startsWith(`${QRCODE_BASE_URL}/users`)) {
      const handle = scanResult.data.replace(`${QRCODE_BASE_URL}/users/`, '');

      setScannedUserHandle(handle);
      userBottomModalRef.current?.present();
    } else if (scanResult.data.startsWith(`${QRCODE_BASE_URL}/events`)) {
      const eventId = scanResult.data.replace(`${QRCODE_BASE_URL}/events/`, '');

      setEventId(Number(eventId));
      eventBottomModalRef.current?.present();
    }

    setActiveTab('My QR Code');
  };
  const handleEventCheckIn = () => {
    addEvent(eventId!);
    setEventId(undefined);
  };

  useEffect(() => {
    return () => {
      setActiveTab('My QR Code');
    };
  }, [isFocused]);

  if (!isNotEmpty(user)) {
    // TODO: Add logged out state
    return <></>;
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
    <>
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
      <UserSheet
        ref={userBottomModalRef}
        onRemoveConnection={handleRemoveConnection}
        onAddConnection={handleAddConnection}
        onDismiss={() => setScannedUserHandle(undefined)}
      />
      <EventSheet
        ref={eventBottomModalRef}
        onCheckIn={handleEventCheckIn}
        onDismiss={() => setEventId(undefined)}
        isLoading={isEventLoading}
      />
    </>
  );
};
