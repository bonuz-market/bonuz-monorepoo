import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';

import { Link, User } from '@/entities';
import { useQueryGetUserProfileAndSocialLinks } from '@/services/blockchain/bonuz/useSocialId';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

import { getIcon } from '../profile.config';

export const ProfileEdit = forwardRef<BottomSheetModal, {}>((props, bottomSheetModalRef) => {
  const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
  useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const user = useUserStore((store) => store.user);
  const { data } = useQueryGetUserProfileAndSocialLinks();

  const { control } = useForm<User>({
    defaultValues: {
      name: data?.name,
      handle: data?.handle,
      socials: data?.socials,
      wallets: data?.wallets,
      messagingApps: data?.messagingApps,
      decentralizedIdentifiers: data?.decentralizedIdentifiers,
    },
  });

  const renderLinkInput = useCallback(
    (type: string, link: Link) => {
      return (
        <View style={tw`flex flex-row gap-2 px-2 w-full items-center bg-[#2b3ca3] rounded-lg`}>
          <View>{getIcon(type, 'normal')}</View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={tw`flex-1 bg-[#2b3ca3] rounded-lg h-12 text-white`}
                placeholder={`Enter your ${type} handle...`}
                placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
                value={value}
                onChangeText={onChange}
              />
            )}
            name={`socials.${type}.handle`}
          />
        </View>
      );
    },
    [control],
  );

  const profilePictureInput = useMemo(() => {
    return (
      <View style={tw`flex flex-col gap-1 items-center`}>
        <Image
          style={tw`w-36 h-36 rounded-full`}
          source={{ uri: data?.profilePicture! }}
          alt="user"
        />
        <Pressable>
          <Text style={tw`text-white text-sm font-medium`}>Set New Photo</Text>
        </Pressable>
      </View>
    );
  }, [data?.profilePicture]);
  const nameAndHandleInput = useMemo(() => {
    return (
      <View style={tw`flex flex-col gap-3 items-center w-full`}>
        <View style={tw`flex flex-col items-start gap-2 w-full`}>
          <Text style={tw`text-white text-sm font-medium`}>Full Name</Text>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={tw`w-full bg-[#2b3ca3] rounded-lg p-4 h-12 text-white`}
                placeholder="Enter your name..."
                placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
                value={value}
                onChangeText={onChange}
              />
            )}
            name="name"
          />
        </View>
        <View style={tw`flex flex-col items-start gap-2 w-full`}>
          <Text style={tw`text-white text-sm font-medium`}>Bonuz Username</Text>

          <Controller
            control={control}
            rules={{
              pattern: /^(?!.*\.\.)(?!.*\.$)\w[\w.]{0,29}$/,
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={tw`w-full bg-[#2b3ca3] rounded-lg p-4 h-12 text-white`}
                placeholder="Enter a username..."
                placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
                value={value}
                onChangeText={onChange}
              />
            )}
            name="handle"
          />
        </View>
      </View>
    );
  }, [control]);

  if (!isNotEmpty(user)) {
    return;
  }

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        backgroundStyle={tw`bg-[#4B2EA2]`}
        ref={_bottomSheetModalRef}
        handleIndicatorStyle={{
          backgroundColor: '#905CFF',
          top: 10,
          height: 5,
          width: 50,
        }}
        style={{ flex: 1 }}
        index={0}
        snapPoints={snapPoints}>
        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
          <BottomSheetSectionList<any, any>
            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
            ListHeaderComponent={
              <View style={tw`flex flex-row items-center justify-center w-full relative h-10`}>
                <Text style={tw`text-white text-base`}>Edit Profile</Text>
                <View style={tw`absolute right-0 top-0 p-3 bg-[#5b38b6] rounded-full ml-auto`}>
                  <Ionicons
                    name="close"
                    size={20}
                    color="#b770ff"
                    onPress={() => {
                      _bottomSheetModalRef.current?.dismiss();
                    }}
                  />
                </View>
              </View>
            }
            sections={[
              {
                title: '',
                renderItem: () => profilePictureInput,
                id: 'profilePicture',
                data: [0],
              },
              {
                title: 'Name & Handle',
                id: 'nameAndHandle',
                renderItem: () => nameAndHandleInput,
                data: [0],
              },
              {
                title: 'Social Media Accounts',
                data: Object.entries(data?.socials ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) => renderLinkInput(item.type, item.link),
              },
              {
                title: 'Messaging Apps',
                data: Object.entries(data?.messagingApps ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) => renderLinkInput(item.type, item.link),
              },
              {
                title: 'Wallets',
                data: Object.entries(data?.wallets ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) => renderLinkInput(item.type, item.link),
              },
              {
                title: 'Decentralized Identifiers',
                data: Object.entries(data?.decentralizedIdentifiers ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) => renderLinkInput(item.type, item.link),
              },
            ]}
            initialNumToRender={10}
            removeClippedSubviews={true}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            stickyHeaderHiddenOnScroll={false}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
              <Text style={tw`text-white text-sm font-medium`}>{section.title}</Text>
            )}
            ItemSeparatorComponent={() => <View style={tw`h-4`} />}
            SectionSeparatorComponent={() => <View style={tw`h-4`} />}
          />
        </LinearGradient>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

ProfileEdit.displayName = 'ProfileEdit';
