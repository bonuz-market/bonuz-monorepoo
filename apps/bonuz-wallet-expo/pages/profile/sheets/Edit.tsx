import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { HTTPError } from 'ky';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';

import userPlaceholderImage from '@/assets/images/profile/user-placeholder.png';
import { Link, User } from '@/entities';
import {
  useMutationSetUserProfile,
  useQueryGetUserProfileAndSocialLinks,
} from '@/services/blockchain/bonuz/useSocialId';
import { useUserStore } from '@/store';
import { useUiStore } from '@/store/ui';
import { isNotEmpty } from '@/utils/object';

import { getIcon } from '../profile.config';

export const ProfileEdit = forwardRef<BottomSheetModal, {}>((props, bottomSheetModalRef) => {
  const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
  useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

  const snapPoints = useMemo(() => ['90%'], []);
  const setIsTabBarHidden = useUiStore((state) => state.setIsTabBarHidden);

  const user = useUserStore((store) => store.user);
  const { data: userData } = useQueryGetUserProfileAndSocialLinks();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();

  const pickImage = async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then(({ granted }) => {
      if (granted) {
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.2,
        }).then((result) => {
          ImageManipulator.manipulateAsync(
            result.assets?.[0].uri ?? '',
            [{ resize: { width: 600 } }],
            {
              compress: 0.2,
              format: ImageManipulator.SaveFormat.JPEG,
            },
          ).then((compressed) => {
            setImage(compressed);
          });
        });
      }
    });
  };

  const { control, handleSubmit, reset, formState } = useForm<User>({
    defaultValues: {
      name: userData?.name,
      handle: userData?.handle,
      socials: userData?.socials,
      wallets: userData?.wallets,
      messagingApps: userData?.messagingApps,
      decentralizedIdentifiers: userData?.decentralizedIdentifiers,
    },
  });

  const { mutateAsync: updateUser } = useMutationSetUserProfile(
    () => {
      Toast.hide();
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
      });
      reset();
      _bottomSheetModalRef.current?.dismiss();
    },
    () => {},
  );

  const renderLinkInput = useCallback(
    (
      type: string,
      link: Link,
      category: 'socials' | 'wallets' | 'messagingApps' | 'decentralizedIdentifiers',
    ) => {
      return (
        <View style={tw`flex flex-row gap-2 px-2 w-full items-center bg-[#2b3ca3] rounded-lg`}>
          <View>{getIcon(type, 'normal')}</View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={tw`flex-1 bg-[#2b3ca3] rounded-lg h-12 text-white`}
                placeholder={`Enter your ${type} handle...`}
                placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
                value={value}
                onChangeText={onChange}
              />
            )}
            name={`${category}.${type}.handle`}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Ionicons
                name={value ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="white"
                onPress={() => onChange(!value)}
              />
            )}
            name={`${category}.${type}.isPublic`}
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
          source={
            (userData?.profilePicture !== null && userData?.profilePicture !== '') || image?.uri
              ? { uri: image?.uri ?? userData?.profilePicture }
              : userPlaceholderImage
          }
          alt="user"
        />
        <Pressable onPress={pickImage}>
          <Text style={tw`text-white text-sm font-medium`}>Set New Photo</Text>
        </Pressable>
      </View>
    );
  }, [userData?.profilePicture, image?.uri]);
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
                style={tw`w-full px-4 bg-[#2b3ca3] rounded-lg h-12 text-white`}
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
                style={tw`w-full px-4 bg-[#2b3ca3] rounded-lg h-12 text-white`}
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

  const handleSave: SubmitHandler<User> = useCallback(
    (data) => {
      try {
        if (!userData) {
          return;
        }
        console.log(data);

        const keys = ['socials', 'wallets', 'messagingApps', 'decentralizedIdentifiers'];
        const updatedData = {};

        for (const key of keys) {
          const updated = Object.entries<Link>(
            data[key as 'socials' | 'wallets' | 'messagingApps' | 'decentralizedIdentifiers'] ?? {},
          ).reduce(
            (acc, [k, value]) => {
              if (
                value.handle !==
                  // @ts-ignore
                  userData[
                    key as 'socials' | 'wallets' | 'messagingApps' | 'decentralizedIdentifiers'
                  ][k]?.handle ||
                value.isPublic !==
                  // @ts-ignore
                  userData[
                    key as 'socials' | 'wallets' | 'messagingApps' | 'decentralizedIdentifiers'
                  ][k]?.isPublic
              ) {
                return {
                  ...acc,
                  [k]: value,
                };
              }
              return acc;
            },
            {} as Record<string, Link>,
          );

          if (Object.keys(updated).length > 0) {
            // @ts-ignore
            updatedData[
              key as 'socials' | 'wallets' | 'messagingApps' | 'decentralizedIdentifiers'
            ] = updated;
          }
        }

        // const validatableWallets = Object.entries(
        //   (data.wallets as Record<
        //     string,
        //     UserLink & {
        //       validation: {
        //         message: string;
        //         signature: string;
        //       };
        //     }
        //   >) ?? {},
        // ).reduce(
        //   (acc, [key, value]) => {
        //     if (value.validation) {
        //       return {
        //         ...acc,
        //         [key]: {
        //           message: value.validation.message,
        //           signature: value.validation.signature,
        //         },
        //       };
        //     }
        //   },
        //   {} as Record<
        //     string,
        //     {
        //       message: string;
        //       signature: string;
        //     }
        //   >,
        // );

        const updatedName = data.name === userData?.name ? undefined : data.name;
        const updatedHandle = data.handle === userData?.handle ? undefined : data.handle;
        const updatedProfilePicture =
          image?.uri && image.uri !== userData?.profilePicture ? image : undefined;

        const dataToUpdate = {
          ...updatedData,
          name: updatedName,
          handle: updatedHandle,
          profilePicture: updatedProfilePicture,
          // validations: {
          //   ...validatableWallets,
          // },
        };

        console.log('dataToUpdate', dataToUpdate);

        if (!Object.values(dataToUpdate).every((value) => value === undefined)) {
          Toast.show({
            type: 'info',
            text1: 'Updating Blockchain...',
            autoHide: false,
            swipeable: true,
          });
          //@ts-ignore
          updateUser(dataToUpdate);
          _bottomSheetModalRef.current?.dismiss();
        }
      } catch (error) {
        console.log("error updating user's profile", error);

        const { message } = error as HTTPError;
        console.log(error);

        console.log(message);
      }
    },
    [image, updateUser, userData],
  );

  const handleAnimate = useCallback(
    (_: number, toIndex: number) => {
      console.log('toIndex', toIndex);

      if (toIndex === -1) {
        setIsTabBarHidden(false);
      } else {
        setIsTabBarHidden(true);
      }
    },
    [setIsTabBarHidden],
  );

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
        snapPoints={snapPoints}
        onAnimate={handleAnimate}
        onDismiss={() => {
          reset();
        }}>
        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
          <BottomSheetSectionList<any, any>
            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
            ListHeaderComponent={
              <View style={tw`flex flex-row items-center justify-center w-full relative h-10`}>
                <Pressable
                  style={tw`absolute left-0 top-0 p-3 bg-[#5b38b6] rounded-full ml-auto`}
                  onPress={() => {
                    _bottomSheetModalRef.current?.dismiss();
                    reset();
                  }}>
                  <Ionicons name="close" size={20} color="#b770ff" />
                </Pressable>
                <Text style={tw`text-white text-base`}>Edit Profile</Text>
                <Pressable
                  style={tw`absolute right-0 top-0 p-3 bg-[#5b38b6] rounded-full ml-auto`}
                  onPress={handleSubmit(handleSave)}>
                  <Ionicons name="checkmark" size={20} color="#b770ff" />
                </Pressable>
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
                title: '',
                id: 'nameAndHandle',
                renderItem: () => nameAndHandleInput,
                data: [1],
              },
              {
                title: 'Social Media Accounts',
                data: Object.entries(userData?.socials ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) => renderLinkInput(item.type, item.link, 'socials'),
              },
              {
                title: 'Messaging Apps',
                data: Object.entries(userData?.messagingApps ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) =>
                  renderLinkInput(item.type, item.link, 'messagingApps'),
              },
              {
                title: 'Wallets',
                data: Object.entries(userData?.wallets ?? {}).map(([type, link]) => ({
                  type,
                  link,
                })),
                renderItem: ({ item }: any) => renderLinkInput(item.type, item.link, 'wallets'),
              },
              {
                title: 'Decentralized Identifiers',
                data: Object.entries(userData?.decentralizedIdentifiers ?? {}).map(
                  ([type, link]) => ({
                    type,
                    link,
                  }),
                ),
                renderItem: ({ item }: any) =>
                  renderLinkInput(item.type, item.link, 'decentralizedIdentifiers'),
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
