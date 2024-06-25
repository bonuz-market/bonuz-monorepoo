import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetFooter, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, FlatList, Image, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Accordion, Section } from '@/components/Accordion/Accordion';
import { CustomBackdrop } from '@/components/sheets/Backdrop';
import { SocialItem } from '@/components/SocialItem/SocialItem';
import { Tabs } from '@/components/Tabs';
import { SocialIdUser } from '@/entities';
import { getIcon } from '@/pages/profile/profile.config';
import { addUserConnection, removeUserConnection } from '@/services/backend';
import { truncateAddress } from '@/utils/wallet';

const SECTIONS = {
  SOCIALS_MEDIA_ACCOUNTS: {
    title: 'Social Media Accounts',
    index: 0,
    background: '#117EFF',
    icon: require('@/assets/images/profile/globe.png'),
  },
  MESSAGING_APPS: {
    title: 'Messaging Apps',
    index: 1,
    background: '#E2A612',
    icon: require('@/assets/images/profile/message.png'),
  },
  WALLETS: {
    title: 'Blockchain & Wallets',
    index: 2,
    background: '#8247E5',
    icon: require('@/assets/images/profile/crypto.png'),
  },
  DECENTRALIZED_IDENTIFERS: {
    title: 'Decentralized Identifiers',
    index: 3,
    background: '#3BAF7E',
    icon: require('@/assets/images/profile/decentralized.png'),
  },
};

const UserSheetContent = ({
  data,
  handleRemoveConnectionPress,
  handleAddConnectionPress,
  isRemoveConnectionLoading,
  isAddConnectionLoading,
}: {
  data: {
    data: SocialIdUser & { address: string; id: number; isCurrentConnection: boolean };
  };
  handleRemoveConnectionPress: () => void;
  handleAddConnectionPress: (userId: number) => void;
  isRemoveConnectionLoading: boolean;
  isAddConnectionLoading: boolean;
}) => {
  const { bottom } = useSafeAreaInsets();

  const [activeSections, setActiveSections] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setActiveSections([SECTIONS.SOCIALS_MEDIA_ACCOUNTS.index]);
    }, 250);
  }, []);
  const [activeTab, setActiveTab] = useState<'On-Chain Social ID' | 'Passes & Vouchers'>(
    'On-Chain Social ID',
  );
  const connection = data?.data;

  const handleAddressCopy = useCallback(async (address: string) => {
    await Clipboard.setStringAsync(address);
  }, []);

  const socialsSection = () => {
    const linksFiltered = Object.values(connection.socials ?? {}).filter((link) => !!link.handle);

    return {
      index: SECTIONS.SOCIALS_MEDIA_ACCOUNTS.index,
      titleComponent: (
        <View style={tw`flex-row gap-4 items-center bg-transparent`}>
          <View
            style={[
              tw`h-10 w-10 rounded-xl justify-center items-center`,
              { backgroundColor: SECTIONS.SOCIALS_MEDIA_ACCOUNTS.background },
            ]}>
            <Image
              source={SECTIONS.SOCIALS_MEDIA_ACCOUNTS.icon}
              style={tw`h-7 w-7`}
              resizeMode="contain"
            />
          </View>
          <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
            {SECTIONS.SOCIALS_MEDIA_ACCOUNTS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View style={tw`bg-transparent`}>
          <FlatList
            data={linksFiltered}
            renderItem={({ item }) => (
              <SocialItem
                // Icon={
                //   getIcon(item.type, 'normal') ?? (
                //     <Icon as={FontAwesome} name={item.type} size={5} />
                //   )
                // }
                leftAddon={getIcon(item.type, 'normal')}
                content={
                  <Text style={{ fontSize: 16, color: 'white', opacity: 0.7 }}>@{item.handle}</Text>
                }
              // RightComponent={
              //   <HStack space={2} alignItems="center" justifyContent="center">
              //     {item.type === SOCIAL_ACCOUNTS.s_x && !item.isVerified && (
              //       <Button
              //         onPress={async () => {
              //           setIsVerifyDone(false);
              //           promptAsync();
              //         }}
              //         size="xs"
              //         colorScheme="fuchsia"
              //         disabled={isVerifyLoading}>
              //         Verify
              //       </Button>
              //     )}
              //     <Ionicons
              //       name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
              //       color="white"
              //       size={20}
              //     />
              //   </HStack>
              // }
              // isVerified={item.isVerified}
              />
            )}
            keyExtractor={(item) => item.type}
            ItemSeparatorComponent={() => (
              <View style={{ height: 10, backgroundColor: 'transparent' }} />
            )}
          // ListEmptyComponent={<EmptySectionMessage text="social media" />}
          />
        </View>
      ),
    };
  };

  const walletsSection = () => {
    const wallets = Object.values(connection.wallets ?? {}).filter((item) => !!item.handle);

    return {
      index: SECTIONS.WALLETS.index,
      titleComponent: (
        <View style={tw`flex-row gap-4 items-center bg-transparent`}>
          <View
            style={[
              tw`h-10 w-10 rounded-xl justify-center items-center`,
              { backgroundColor: SECTIONS.WALLETS.background },
            ]}>
            <Image source={SECTIONS.WALLETS.icon} style={tw`h-7 w-7`} resizeMode="contain" />
          </View>
          <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
            {SECTIONS.WALLETS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View style={tw`bg-transparent`}>
          <FlatList
            data={wallets}
            renderItem={({ item }) => (
              <SocialItem
                //   Icon={
                //     getIcon(item.type, 'normal') ?? (
                //       <Icon as={FontAwesome} name={item.type} size={5} />
                //     )
                //   }
                leftAddon={getIcon(item.type, 'normal')}
                content={
                  <Text style={{ fontSize: 16, color: 'white', opacity: 0.7 }}>{item.handle}</Text>
                }

              //   isVerified={item.isVerified}
              />
            )}
            keyExtractor={(item) => item.type}
            ItemSeparatorComponent={() => (
              <View style={{ height: 10, backgroundColor: 'transparent' }} />
            )}
          // ListEmptyComponent={<EmptySectionMessage text="wallets" />}
          />
        </View>
      ),
    };
  };

  const messagingAppsSection = () => {
    const messagingApps = Object.values(connection.messagingApps ?? {}).filter(
      (item) => !!item.handle,
    );

    return {
      index: SECTIONS.MESSAGING_APPS.index,
      titleComponent: (
        <View style={tw`flex-row gap-4 items-center bg-transparent`}>
          <View
            style={[
              tw`h-10 w-10 rounded-xl justify-center items-center`,
              { backgroundColor: SECTIONS.MESSAGING_APPS.background },
            ]}>
            <Image source={SECTIONS.MESSAGING_APPS.icon} style={tw`h-7 w-7`} resizeMode="contain" />
          </View>
          <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
            {SECTIONS.MESSAGING_APPS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View style={tw`bg-transparent`}>
          <FlatList
            data={messagingApps}
            renderItem={({ item }) => (
              <SocialItem
                //   Icon={
                //     getIcon(item.type, 'normal') ?? (
                //       <Icon as={FontAwesome} name={item.type} size={5} />
                //     )
                //   }
                leftAddon={getIcon(item.type, 'normal')}
                content={
                  <Text style={{ fontSize: 16, color: 'white', opacity: 0.7 }}>{item.handle}</Text>
                }
              //   text={item.handle}

              //   isVerified={item.isVerified}
              />
            )}
            keyExtractor={(item) => item.type}
            ItemSeparatorComponent={() => (
              <View style={{ height: 10, backgroundColor: 'transparent' }} />
            )}
          // ListEmptyComponent={<EmptySectionMessage text="messaging apps" />}
          />
        </View>
      ),
    };
  };

  const othersSection = () => {
    const others = Object.values(connection.decentralizedIdentifiers ?? {}).filter(
      (item) => !!item.handle,
    );

    return {
      index: SECTIONS.DECENTRALIZED_IDENTIFERS.index,
      titleComponent: (
        <View style={tw`flex-row gap-4 items-center bg-transparent`}>
          <View
            style={[
              tw`h-10 w-10 rounded-xl justify-center items-center`,
              { backgroundColor: SECTIONS.DECENTRALIZED_IDENTIFERS.background },
            ]}>
            <Image
              source={SECTIONS.DECENTRALIZED_IDENTIFERS.icon}
              style={tw`h-7 w-7`}
              resizeMode="contain"
            />
          </View>
          <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
            {SECTIONS.DECENTRALIZED_IDENTIFERS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View style={tw`bg-transparent`}>
          <FlatList
            data={others}
            renderItem={({ item }) => (
              <SocialItem
                // Icon={
                //   getIcon(item.type, 'normal') ?? (
                //     <Icon as={FontAwesome} name={item.type} size={5} />
                //   )
                // }
                leftAddon={getIcon(item.type, 'normal')}
                content={
                  <Text style={{ fontSize: 16, color: 'white', opacity: 0.7 }}>{item.handle}</Text>
                }

              // isVerified={item.isVerified}
              />
            )}
            keyExtractor={(item) => item.type}
            ItemSeparatorComponent={() => (
              <View style={{ height: 10, backgroundColor: 'transparent' }} />
            )}
          // ListEmptyComponent={<EmptySectionMessage text="decentralized identifiers" />}
          />
        </View>
      ),
    };
  };
  const sections = () => {
    const sections: Section[] = [
      socialsSection(),
      messagingAppsSection(),
      walletsSection(),
      othersSection(),
    ];

    return sections;
  };

  const onAccordionChange = (activeSections: number[]) => {
    const isSingleItem = sections.length === 1;
    if (isSingleItem) {
      return;
    }

    setActiveSections(activeSections);
  };

  return (
    <BottomSheetFlatList
      data={[0]}
      ListHeaderComponent={
        <View style={tw`flex flex-col items-center`}>
          <View style={tw`relative w-full h-[350px] `}>
            <Image
              style={tw`w-full h-[350px] rounded-t-[30px] `}
              source={
                connection.profilePicture
                  ? { uri: connection.profilePicture }
                  : require('@/assets/images/profile/defaultAvatar.jpg')
              }
            />
            <BlurView
              intensity={Platform.OS === 'ios' ? 25 : 10}
              tint={Platform.OS === 'ios' ? 'light' : 'dark'}
              experimentalBlurMethod="dimezisBlurView"
              style={tw.style(`absolute -bottom-2 rounded-t-full overflow-hidden w-full`)}>
              <View
                style={tw`bg-transparent h-14 flex-1 justify-center w-[100%] rounded-t-3xl items-center`}>
                <View style={tw`rounded-xl px-2.5 py-2 flex flex-row items-center gap-2`}>
                  <Ionicons name="wallet-outline" size={20} color="white" style={tw`opacity-70`} />
                  <Text style={tw`text-white text-sm font-semibold`}>
                    {truncateAddress(connection.address)}
                  </Text>
                  <Pressable onPress={() => handleAddressCopy(connection.address)} hitSlop={30}>
                    <Ionicons name="copy-outline" size={20} color="white" style={tw`opacity-70`} />
                  </Pressable>
                </View>
              </View>
            </BlurView>
          </View>
          <View style={tw`flex-row gap-2 items-start justify-between mt-4 w-full px-4`}>
            <View>
              <Text style={tw`text-white text-3xl font-semibold`}>{connection.name}</Text>
              <Text style={tw`text-white opacity-80 text-sm font-semibold`}>
                @{connection.handle}
              </Text>
            </View>
            <View style={tw`flex-row justify-start items-center`}>
              {connection.isCurrentConnection ? (
                <Pressable
                  onPress={handleRemoveConnectionPress}
                  style={tw.style(`p-2 mt-0.5 rounded-full bg-red-600 flex-row gap-2`, {
                    opacity: isRemoveConnectionLoading ? 0.5 : 1,
                  })}
                  disabled={isRemoveConnectionLoading}>
                  {isRemoveConnectionLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <MaterialCommunityIcons name="account-remove-outline" size={20} color="white" />
                  )}
                  <Text style={tw`text-white text-sm font-semibold`}>Remove Connection</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleAddConnectionPress(connection.id)}
                  style={tw.style(`p-2 mt-0.5 rounded-full bg-green-600 flex-row gap-2`, {
                    opacity: isAddConnectionLoading ? 0.5 : 1,
                  })}
                  disabled={isAddConnectionLoading}>
                  {isAddConnectionLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <MaterialCommunityIcons name="account-plus-outline" size={20} color="white" />
                  )}
                  <Text style={tw`text-white text-sm font-semibold`}>Add Connection</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      }
      ListHeaderComponentStyle={tw`mb-4`}
      ListFooterComponent={<View style={{ paddingBottom: bottom }}></View>}
      renderItem={() => (
        <View style={tw`flex gap-4`}>
          <View style={tw`px-4`}>
            <Tabs
              tabs={['On-Chain Social ID', 'Passes & Vouchers']}
              value={activeTab}
              onValueChange={(tab) => setActiveTab(tab)}
            />
          </View>
          {activeTab === 'On-Chain Social ID' ? (
            <Accordion
              sections={sections()}
              activeSections={activeSections}
              onAccordionChange={onAccordionChange}
            />
          ) : (
            <View style={tw`px-4 flex items-center justify-center`}>
              <Text style={tw`text-white text-lg`}>Coming Soon!</Text>
            </View>
          )}
        </View>
      )}
    />
  );
};

interface UserSheetProps {
  onAddConnection: () => void;
  onRemoveConnection: () => void;
  onDismiss: () => void;
  snapPoints?: string[];
}

export const UserSheet = forwardRef<BottomSheetModal, UserSheetProps>(
  ({ onAddConnection, onRemoveConnection, onDismiss, snapPoints }, bottomSheetModalRef) => {
    const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

    const connectionIdRef = useRef<number>();

    const [shouldShowRemoveConnectionFooter, setShouldShowRemoveConnectionFooter] = useState(false);
    const { bottom } = useSafeAreaInsets();
    const _snapPoints = useMemo(() => snapPoints ?? ['90%'], [snapPoints]);

    const { mutateAsync: removeConnection, isPending: isRemoveConnectionLoading } = useMutation({
      mutationKey: ['removeConnection'],
      mutationFn: async (userId: number) => removeUserConnection(userId),
      onSuccess: onRemoveConnection,
    });
    const { mutateAsync: addConnection, isPending: isAddConnectionLoading } = useMutation({
      mutationKey: ['addConnection'],
      mutationFn: async (userId: number) => addUserConnection(userId),
      onSuccess: onAddConnection,
    });

    const handleRemoveConnectionButtonPress = async () => {
      setShouldShowRemoveConnectionFooter(true);
    };

    const handleCancelRemoveConnection = () => {
      setShouldShowRemoveConnectionFooter(false);
    };

    const handleRemoveConnection = async () => {
      if (!connectionIdRef.current) return;
      await removeConnection(connectionIdRef.current);
      setShouldShowRemoveConnectionFooter(false);
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
          shouldShowRemoveConnectionFooter && (
            <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
              <BlurView
                intensity={Platform.OS === 'ios' ? 25 : 10}
                tint={Platform.OS === 'ios' ? 'light' : 'dark'}
                experimentalBlurMethod="dimezisBlurView"
                style={[
                  tw`flex-1 overflow-hidden flex flex-row gap-4 items-center justify-between rounded-[30px] px-4`,
                  { paddingBottom: bottom, paddingTop: 12 },
                ]}>
                <Pressable
                  style={tw`rounded-full justify-center items-center`}
                  onPress={handleCancelRemoveConnection}>
                  <BlurView
                    intensity={Platform.OS === 'ios' ? 50 : 30}
                    tint={Platform.OS === 'ios' ? 'light' : 'dark'}
                    experimentalBlurMethod="dimezisBlurView"
                    style={[
                      tw` p-4 overflow-hidden flex flex-row gap-2 items-center justify-center rounded-[30px]`,
                    ]}>
                    <Text
                      style={tw.style(`text-white text-base font-semibold`, {
                        opacity: isRemoveConnectionLoading ? 0.5 : 1,
                      })}>
                      Cancel
                    </Text>
                  </BlurView>
                </Pressable>
                <Pressable
                  style={tw`rounded-full justify-center items-center`}
                  onPress={handleRemoveConnection}
                  disabled={isRemoveConnectionLoading}>
                  <BlurView
                    intensity={Platform.OS === 'ios' ? 50 : 30}
                    tint={Platform.OS === 'ios' ? 'light' : 'dark'}
                    experimentalBlurMethod="dimezisBlurView"
                    style={[
                      tw`w-full p-4 overflow-hidden bg-red-500 flex flex-row gap-2 items-center justify-center rounded-[30px]`,
                    ]}>
                    {isRemoveConnectionLoading && <ActivityIndicator size="small" color="white" />}
                    <Text
                      style={tw.style(`text-white text-base font-semibold`, {
                        opacity: isRemoveConnectionLoading ? 0.5 : 1,
                      })}>
                      Remove Connection
                    </Text>
                  </BlurView>
                </Pressable>
              </BlurView>
            </BottomSheetFooter>
          )
        }
        onDismiss={() => {
          onDismiss();
          setShouldShowRemoveConnectionFooter(false);
        }}
        index={0}
        snapPoints={_snapPoints}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
        backdropComponent={CustomBackdrop}>
        {(data) => {
          if (!data?.data)
            return (
              <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="white" />
              </View>
            );
          console.log('data', data);

          connectionIdRef.current = data?.data.id;
          return (
            <>
              <UserSheetContent
                data={data!}
                handleRemoveConnectionPress={handleRemoveConnectionButtonPress}
                handleAddConnectionPress={addConnection}
                isRemoveConnectionLoading={isRemoveConnectionLoading}
                isAddConnectionLoading={isAddConnectionLoading}
              />
            </>
          );
        }}
      </BottomSheetModal>
    );
  },
);

UserSheet.displayName = 'ConnectionSheet';
