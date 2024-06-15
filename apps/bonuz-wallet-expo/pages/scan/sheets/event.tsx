import { BottomSheetFooter, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { CustomBackdrop } from '@/components/sheets/Backdrop';
import { removeUserConnection } from '@/services/backend';

interface EventSheetContentProps {
  data: any;
  handleCheckInPress: () => void;
}

const _data = {
  title: 'Event Title',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi. Sed nec nunc nec purus feugiat, molestie ipsum et, ultricies nunc. Nulla facilisi.',
  image: {
    url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
};

const EventSheetContent = ({ data, handleCheckInPress }: EventSheetContentProps) => {
  return (
    <View style={tw`flex-1 gap-4`}>
      <View style={tw`relative w-full h-[250px] `}>
        <Image
          style={tw`w-full h-[250px] rounded-t-[30px] `}
          source={
            data.image ? { uri: data.image.url } : require('@/assets/images/profile/profile.png')
          }
        />
      </View>
      <View style={tw`p-4`}>
        <Text style={tw`text-white text-lg font-semibold`}>{data.title}</Text>
        <Text style={tw`text-white text-base mt-2`}>{data.description}</Text>
      </View>
    </View>
  );
};

interface EventSheetProps {
  isLoading: boolean;
  onCheckIn: () => void;
  onDismiss: () => void;
}

export const EventSheet = forwardRef<BottomSheetModal, EventSheetProps>(
  ({ onCheckIn, onDismiss, isLoading }, bottomSheetModalRef) => {
    const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

    const eventIdRef = useRef<number>();

    const { bottom } = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['65%', '90%'], []);

    const { mutateAsync: checkIn, isPending } = useMutation({
      mutationKey: ['checkIn'],
      mutationFn: async (eventId: number) => removeUserConnection(eventId),
      onSuccess: onCheckIn,
    });

    const handleCheckIn = async () => {
      if (!eventIdRef.current) return;
      await checkIn(eventIdRef.current);
      _bottomSheetModalRef.current?.dismiss();
    };

    return (
      <BottomSheetModal
        backgroundStyle={tw.style(`bg-[#4B2EA2] rounded-[30px]`)}
        ref={_bottomSheetModalRef}
        handleComponent={() => (
          <View style={tw`absolute bg-transparent w-full flex items-center`}>
            <View style={tw`w-12 h-1.5 top-2.5 rounded-full bg-white`} />
          </View>
        )}
        footerComponent={({ animatedFooterPosition }) =>
          !isLoading && (
            <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
              <BlurView
                intensity={Platform.OS === 'ios' ? 25 : 10}
                tint={Platform.OS === 'ios' ? 'light' : 'dark'}
                experimentalBlurMethod="dimezisBlurView"
                style={[
                  tw`flex-1 overflow-hidden flex flex-row gap-4 items-center justify-between rounded-[30px] px-4`,
                  { paddingBottom: bottom, paddingTop: 12 },
                ]}>
                <Pressable style={tw`flex-1`} onPress={handleCheckIn}>
                  {({ pressed }) => (
                    <LinearGradient
                      colors={['#E79413', '#EA3E5B', '#FA0AF0']}
                      locations={[0, 0.48, 1]}
                      start={{ x: 1.080_070_525_179_600_3, y: 0.876_702_203_641_700_2 }}
                      end={{ x: -0.080_070_525_179_600_34, y: 0.123_297_796_358_299_85 }}
                      style={tw.style(
                        `flex-1 items-center justify-center rounded-[30px] px-8 py-4`,
                        {
                          opacity: pressed ? 0.8 : 1,
                        },
                      )}>
                      <Text style={tw`text-white text-lg font-semibold`}>
                        {isPending ? <ActivityIndicator color="#fff" /> : 'Check In'}
                      </Text>
                    </LinearGradient>
                  )}
                </Pressable>
              </BlurView>
            </BottomSheetFooter>
          )
        }
        onDismiss={onDismiss}
        index={0}
        snapPoints={snapPoints}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
        backdropComponent={CustomBackdrop}>
        {(data) => {
          console.log(data, 'data');
          if (!data?.data || isLoading)
            return (
              <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="white" />
              </View>
            );
          eventIdRef.current = data?.data.id;
          return (
            <>
              <EventSheetContent data={_data} handleCheckInPress={handleCheckIn} />
            </>
          );
        }}
      </BottomSheetModal>
    );
  },
);

EventSheet.displayName = 'EventSheet';
