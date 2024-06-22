import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetFooter, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import React, {
  forwardRef,
  useCallback,
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
import { SocialIdUser } from '@/entities';
import { getIcon } from '@/pages/profile/profile.config';
import { removeUserConnection } from '@/services/backend';
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

const ConnectionSheetContent = ({
  data,
  handleRemoveConnectionPress,
}: {
  data: {
    data: SocialIdUser & { address: string; id: number };
  };
  handleRemoveConnectionPress: () => void;
}) => {
  const { bottom } = useSafeAreaInsets();

  const [activeSections, setActiveSections] = useState([SECTIONS.SOCIALS_MEDIA_ACCOUNTS.index]);

  const connection = data?.data as SocialIdUser & { address: string };
  console.log('connection', connection);

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
          <View style={tw`flex-col gap-1`}>
            <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
              {SECTIONS.SOCIALS_MEDIA_ACCOUNTS.title}
            </Text>
            <View style={tw`flex-row gap-1`}>
              {linksFiltered.length > 0 && linksFiltered.map((item) => getIcon(item.type, 'small'))}
            </View>
          </View>
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
          <View style={tw`flex-col gap-1`}>
            <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
              {SECTIONS.WALLETS.title}
            </Text>
            <View style={tw`flex-row gap-1`}>
              {wallets.length > 0 && wallets.map((item) => getIcon(item.type, 'small'))}
            </View>
          </View>
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
          <View style={tw`flex-col gap-1`}>
            <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
              {SECTIONS.MESSAGING_APPS.title}
            </Text>
            <View style={tw`flex-row gap-1`}>
              {messagingApps.length > 0 && messagingApps.map((item) => getIcon(item.type, 'small'))}
            </View>
          </View>
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
          <View style={tw`flex-col gap-1`}>
            <Text style={tw`text-white text-base font-medium`} numberOfLines={1}>
              {SECTIONS.DECENTRALIZED_IDENTIFERS.title}
            </Text>
            <View style={tw`flex-row gap-1`}>
              {others.length > 0 && others.map((item) => getIcon(item.type, 'small'))}
            </View>
          </View>
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
              <Pressable
                onPress={handleRemoveConnectionPress}
                style={tw`p-2 mt-0.5 rounded-full bg-red-600`}>
                <MaterialCommunityIcons name="account-remove-outline" size={20} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      }
      ListHeaderComponentStyle={tw`mb-4`}
      ListFooterComponent={<View style={{ paddingBottom: bottom }}></View>}
      renderItem={() => (
        <>
          <Accordion
            sections={sections()}
            activeSections={activeSections}
            onAccordionChange={onAccordionChange}
          />
        </>
      )}
    />
  );
};

interface ConnectionSheetProps {
  onRemoveConnection: () => void;
}

export const ConnectionSheet = forwardRef<BottomSheetModal, ConnectionSheetProps>(
  ({ onRemoveConnection }, bottomSheetModalRef) => {
    const _bottomSheetModalRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(bottomSheetModalRef, () => _bottomSheetModalRef.current!, []);

    const connectionIdRef = useRef<number>();

    const [shouldShowRemoveConnectionFooter, setShouldShowRemoveConnectionFooter] = useState(false);
    const { bottom } = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['90%'], []);

    const { mutateAsync: removeConnection, isPending } = useMutation({
      mutationKey: ['removeConnection'],
      mutationFn: async (userId: number) => removeUserConnection(userId),
      onSuccess: onRemoveConnection,
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
                        opacity: isPending ? 0.5 : 1,
                      })}>
                      Cancel
                    </Text>
                  </BlurView>
                </Pressable>
                <Pressable
                  style={tw`rounded-full justify-center items-center`}
                  onPress={handleRemoveConnection}
                  disabled={isPending}>
                  <BlurView
                    intensity={Platform.OS === 'ios' ? 50 : 30}
                    tint={Platform.OS === 'ios' ? 'light' : 'dark'}
                    experimentalBlurMethod="dimezisBlurView"
                    style={[
                      tw`w-full p-4 overflow-hidden bg-red-500 flex flex-row gap-2 items-center justify-center rounded-[30px]`,
                    ]}>
                    {isPending && <ActivityIndicator size="small" color="white" />}
                    <Text
                      style={tw.style(`text-white text-base font-semibold`, {
                        opacity: isPending ? 0.5 : 1,
                      })}>
                      Remove Connection
                    </Text>
                  </BlurView>
                </Pressable>
              </BlurView>
            </BottomSheetFooter>
          )
        }
        onDismiss={() => setShouldShowRemoveConnectionFooter(false)}
        index={0}
        snapPoints={snapPoints}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
        backdropComponent={CustomBackdrop}>
        {(data) => {
          connectionIdRef.current = data?.data.id;
          return (
            <>
              <ConnectionSheetContent
                data={data!}
                handleRemoveConnectionPress={handleRemoveConnectionButtonPress}
              />
            </>
          );
        }}
      </BottomSheetModal>
    );
  },
);

ConnectionSheet.displayName = 'ConnectionSheet';
