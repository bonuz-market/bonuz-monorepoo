import { BottomSheetFooter, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { HTTPError } from 'ky';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { CustomBackdrop } from '@/components/sheets/Backdrop';
import { Event } from '@/entities/event';
import { checkInEvent } from '@/services/backend/events.service';

interface EventSheetContentProps {
  data: Event;
  handleCheckInPress: () => void;
}

const EventSheetContent = ({ data, handleCheckInPress }: EventSheetContentProps) => {
  console.log(data, 'data');

  return (
    <View style={tw`flex-1 gap-4`}>
      <View style={tw`relative w-full h-[250px] `}>
        <Image
          style={tw`w-full h-[250px] rounded-t-[30px] `}
          source={
            data.image
              ? { uri: data.image.url }
              : require('@/assets/images/profile/defaultAvatar.jpg')
          }
        />
      </View>
      <View style={tw`p-4`}>
        <Text style={tw`text-white text-lg font-semibold`}>{data.title}</Text>
        <Markdown
          style={{
            text: {
              color: 'white',
            },
          }}>
          {data.shortDescription}
        </Markdown>
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

    const {
      mutateAsync: checkIn,
      isPending,
      error,
    } = useMutation({
      mutationKey: ['checkIn'],
      mutationFn: async (eventId: number) => checkInEvent(eventId),
      onSuccess: onCheckIn,
    });

    console.log((error as HTTPError)?.response.json().then(console.log), 'error');

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
          eventIdRef.current = data.data.id;
          return <EventSheetContent data={data.data as Event} handleCheckInPress={handleCheckIn} />;
        }}
      </BottomSheetModal>
    );
  },
);

EventSheet.displayName = 'EventSheet';
