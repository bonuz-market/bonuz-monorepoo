import type { ScrollHeaderProps, ScrollLargeHeaderProps } from '@codeherence/react-native-header';
import {
  FadingView,
  Header,
  LargeHeader,
  SectionListWithHeaders,
} from '@codeherence/react-native-header';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
// import { Image } from 'expo-image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  RefreshControlComponent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Accordion, Section } from '@/components/Accordion/Accordion';
import { SocialItem } from '@/components/SocialItem/SocialItem';
import { Tabs } from '@/components/Tabs';
import { SocialIdUser, Wallet } from '@/entities';
import { NFT } from '@/entities/nfts';
import { useBottomTabBarMargin } from '@/hooks/useBottomTabBarHeight';
import { getNftsByAddress } from '@/services/backend';
import { useQueryGetUserProfileAndSocialLinks } from '@/services/blockchain/bonuz/useSocialId';
import { useUserStore } from '@/store';

import { ItemsCarousel } from '../components/ItemsCarousel';
import { getIcon } from '../profile.config';
import { ProfileEdit } from '../sheets';

// From reading comments online, the BlurView does not work properly for Android <= 11.
// We will have a boolean to check if we can use the BlurView.
// Note that Android 12 begins at SDK version 31
const canUseBlurView =
  Platform.OS === 'ios' || (Platform.OS === 'android' && Number(Platform.Version) >= 31);

const VERTICAL_SPACING = 12;
const ROOT_HORIZONTAL_PADDING = 12;
const BANNER_BOTTOM_HEIGHT_ADDITION = 350;

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
const TOKEN_TYPES = {
  VOUCHER: {
    name: 'Vouchers',
    value: 'VOUCHER',
  },
  MEMBERSHIP: {
    name: 'Memberships',
    value: 'MEMBERSHIP',
  },
  LOYALTY: {
    name: 'Loyalty Programs',
    value: 'LOYALTY',
  },
  POP: {
    name: 'Proof of Participation',
    value: 'POP',
  },
  CERTIFICATE: {
    name: 'Certificates',
    value: 'CERTIFICATE',
  },
};

const HeaderComponent = ({
  showNavBar,
  scrollY,
  data,
}: ScrollHeaderProps & {
  data: SocialIdUser;
}) => {
  const { left, right } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const bannerHeight = useSharedValue(48 + BANNER_BOTTOM_HEIGHT_ADDITION);

  const blurStyle = useAnimatedStyle(() => {
    const blurOpacity = interpolate(
      Math.abs(scrollY.value > 0 ? scrollY.value : 0),
      [0, 40],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return { opacity: blurOpacity };
  });

  const bannerTranslationStyle = useAnimatedStyle(() => {
    const bannerTranslation = interpolate(
      scrollY.value,
      [0, BANNER_BOTTOM_HEIGHT_ADDITION],
      [0, -BANNER_BOTTOM_HEIGHT_ADDITION],
      Extrapolation.CLAMP,
    );

    return { transform: [{ translateY: bannerTranslation }] };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(
      scrollY.value,
      [0, -(height + bannerHeight.value)],
      [1, 1.5],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scaleY }, { scaleX: scaleY }],
    };
  }, [height]);

  return (
    <View style={tw`relative`}>
      <Animated.View style={[StyleSheet.absoluteFill, bannerTranslationStyle]}>
        <Animated.View
          onLayout={(e) => (bannerHeight.value = e.nativeEvent.layout.height)}
          style={animatedScaleStyle}>
          <View style={{ marginBottom: -BANNER_BOTTOM_HEIGHT_ADDITION, position: 'relative' }}>
            {canUseBlurView ? (
              <Animated.View style={[StyleSheet.absoluteFill, tw`z-10`, blurStyle]}>
                <BlurView style={[StyleSheet.absoluteFill]} intensity={50} tint="dark" />
              </Animated.View>
            ) : (
              <Animated.View
                style={[StyleSheet.absoluteFill, tw`z-10`, tw`bg-[rgba(0,0,0,0.5)]`, blurStyle]}
              />
            )}

            <Image
              source={
                data?.profilePicture
                  ? { uri: data.profilePicture }
                  : require('@/assets/images/profile/defaultAvatar.jpg')
              }
              //   contentFit="cover"
              //   contentPosition="center"
              style={[
                tw`h-full`,
                { width },
                Platform.OS === 'web' && { height: bannerHeight.value },
              ]}
            />
          </View>
        </Animated.View>
      </Animated.View>

      <Header
        showNavBar={showNavBar}
        headerCenterFadesIn={false}
        headerStyle={tw`bg-transparent`}
        noBottomBorder
        headerRight={
          <Pressable
            onPress={() => { }}
            style={tw`w-13 h-13 rounded-full justify-center items-center bg-[#E9A08F]`}
            hitSlop={30}>
            <Image style={tw`w-7 h-7`} source={require('@/assets/images/profile/share.png')} />
          </Pressable>
        }
        headerRightStyle={[tw`pl-3`, { paddingLeft: Math.max(right, ROOT_HORIZONTAL_PADDING) }]}
        headerLeft={
          <View style={tw`flex flex-row gap-2 items-center`}>
            <Link href="/settings" asChild>
              <Pressable
                style={tw`w-13 h-13 rounded-full justify-center items-center bg-[#E9A08F]`}
                hitSlop={30}>
                <Image
                  style={tw`w-7 h-7`}
                  source={require('@/assets/images/profile/settings.png')}
                />
              </Pressable>
            </Link>
            <FadingView opacity={showNavBar}>
              <Text style={tw`text-base font-bold text-white`}>{data?.name}</Text>
              <Text style={tw`text-[#ffffff99] text-xs`}>@{data?.handle}</Text>
            </FadingView>
          </View>
        }
        headerLeftStyle={[tw`pl-3`, { paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING) }]}
      />
    </View>
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps & { tabs: React.ReactNode }> = ({
  tabs,
}) => {
  const { left, right } = useSafeAreaInsets();

  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 25 : 10}
      tint={Platform.OS === 'ios' ? 'light' : 'dark'}
      experimentalBlurMethod="dimezisBlurView"
      style={[
        tw`-top-4 rounded-t-[30px] overflow-hidden`,
        { marginTop: BANNER_BOTTOM_HEIGHT_ADDITION - VERTICAL_SPACING },
      ]}>
      <LargeHeader
        headerStyle={[
          {
            paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING),
            paddingRight: Math.max(right, ROOT_HORIZONTAL_PADDING),
          },
          tw`flex flex-col px-0 bg-transparent gap-0 pb-0 z-50`,
        ]}>
        <View style={tw.style(`px-4 py-3`)}>{tabs}</View>
      </LargeHeader>
    </BlurView>
  );
};

export const ProfileHome = () => {
  const tabBarMargin = useBottomTabBarMargin();
  const address = useUserStore((state) => (state.wallet as Wallet).address);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    refetch: refetchUserData,
  } = useQueryGetUserProfileAndSocialLinks();

  const bottomModalRef = useRef<BottomSheetModal>(null);

  const tabs = ['On-Chain Social ID', 'Items'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [activeSections, setActiveSections] = useState([SECTIONS.SOCIALS_MEDIA_ACCOUNTS.index]);

  const socialsSection = useMemo<Section>(() => {
    const linksFiltered = Object.values(userData?.socials ?? {}).filter((link) => !!link.handle);

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
                rightAddon={
                  <Ionicons
                    name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
                    color="white"
                    size={20}
                  />
                } // RightComponent={
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
  }, [userData?.socials]);

  const walletsSection = useMemo<Section>(() => {
    const wallets = Object.values(userData?.wallets ?? {}).filter((item) => !!item.handle);

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
                rightAddon={
                  <Ionicons
                    name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
                    color="white"
                    size={20}
                  />
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
  }, [userData?.wallets]);

  const messagingAppsSection = useMemo<Section>(() => {
    const messagingApps = Object.values(userData?.messagingApps ?? {}).filter(
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
                rightAddon={
                  <Ionicons
                    name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
                    color="white"
                    size={20}
                  />
                }
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
  }, [userData?.messagingApps]);

  const othersSection = useMemo<Section>(() => {
    const others = Object.values(userData?.decentralizedIdentifiers ?? {}).filter(
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
                rightAddon={
                  <Ionicons
                    name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
                    color="white"
                    size={20}
                  />
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
  }, [userData?.decentralizedIdentifiers]);
  const sections = useMemo<Section[]>(() => {
    const sections: Section[] = [
      socialsSection,
      messagingAppsSection,
      walletsSection,
      othersSection,
    ];

    return sections;
  }, [messagingAppsSection, socialsSection, othersSection, walletsSection]);

  const onAccordionChange = useCallback(
    (activeSections: number[]) => {
      const isSingleItem = sections.length === 1;
      if (isSingleItem) {
        return;
      }

      setActiveSections(activeSections);
    },
    [sections.length],
  );

  const onEditPress = () => {
    if (isUserDataLoading) {
      return;
    }

    bottomModalRef.current?.present();
  };

  const {
    data: nftsData,
    isLoading: isNftsLoading,
    refetch: refetchNftsData,
  } = useQuery({
    queryKey: ['nftsInProfile', address],
    queryFn: async ({ queryKey }) => getNftsByAddress(queryKey[1]),
    select: (data) => {
      return (
        data.data.nfts.filter(
          (item) =>
            item.contract_address.toLowerCase() ===
            '0xf13d5259421D84C56A886a6e4F18814555eEb24c'.toLowerCase(),
        ) ?? []
      );
    },
    refetchOnMount: true,
  });

  const itemsByTokenType = useMemo(() => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.values(TOKEN_TYPES).reduce(
      (acc, tokenType) => {
        const items = nftsData?.filter((item) =>
          item.attributes?.some((attr) => attr.key === 'Type' && attr.value === tokenType.value),
        );
        return { ...acc, [tokenType.value]: items ?? [] };
      },
      {} as Record<string, NFT[]>,
    );
  }, [nftsData]);

  const userItems = [
    {
      gradient: ['#F67640', '#F14375'],
      image: require('@/assets/images/home/rewards.png'),
      title: 'All Items',
      subtitle: `${nftsData?.length} Items`,
      index: 0,
      data: nftsData,
    },
    {
      gradient: ['#009EFD', '#2AF598'],
      image: require('@/assets/images/home/rewards.png'),
      title: 'Vouchers',
      subtitle: `${itemsByTokenType.VOUCHER.length} Items`,
      index: 1,
      data: itemsByTokenType.VOUCHER,
    },
    {
      gradient: ['#3D73EB', '#DE8FFF'],
      image: require('@/assets/images/home/rewards.png'),
      title: 'Memberships',
      subtitle: `${itemsByTokenType.MEMBERSHIP.length} Items`,
      index: 2,
      data: itemsByTokenType.MEMBERSHIP,
    },
    {
      gradient: ['#F6866F', '#F971A8'],
      image: require('@/assets/images/home/rewards.png'),
      title: 'Loyalty Programs',
      subtitle: `${itemsByTokenType.LOYALTY.length} Items`,
      index: 3,
      data: itemsByTokenType.LOYALTY,
    },
    {
      gradient: ['#6A34D3', '#5B17DE', '#FB308D'],
      image: require('@/assets/images/home/rewards.png'),
      title: 'Proof of Participation',
      subtitle: `${itemsByTokenType.POP.length} Items`,
      index: 4,
      data: itemsByTokenType.POP,
    },
    {
      gradient: ['#375F90', '#7335FF'],
      image: require('@/assets/images/home/rewards.png'),
      title: 'Certificates',
      subtitle: `${itemsByTokenType.LOYALTY.length} Items`,
      index: 5,
      data: itemsByTokenType.CERTIFICATE,
    },
  ];

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const handleRefresh = () => {
    refetchUserData();
    refetchNftsData();
  };

  return (
    <>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 25 : 10}
          tint={Platform.OS === 'ios' ? 'light' : 'dark'}
          experimentalBlurMethod="dimezisBlurView"
          style={[tw`flex-1`]}>
          <SectionListWithHeaders
            HeaderComponent={(props) => <HeaderComponent {...props} data={userData!} />}
            LargeHeaderComponent={(props) => (
              <LargeHeaderComponent
                {...props}
                tabs={
                  <Tabs
                    tabs={tabs}
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value)}
                    activeStyle={tw`bg-white`}
                    containerStyle={tw`bg-[#c5c5c567]`}
                    textStyle={tw`text-white`}
                  />
                }
              />
            )}
            refreshControl={
              <RefreshControl
                onRefresh={handleRefresh}
                refreshing={isUserDataLoading || isNftsLoading}
                tintColor={'black'}
              />
            }
            refreshing={isUserDataLoading || isNftsLoading}
            sections={[{ data: [0] }]}
            // Disabling auto fix scroll since the header is quite large and we want to
            // allow the user to scroll it partially to view content.
            disableAutoFixScroll
            // We ignore safe areas since we want the banner to apply the safe area more granularly
            // to each header. This will allow the banner to maintain a full width, while adjusting
            // other relevant components to respect the safe area.
            ignoreLeftSafeArea
            ignoreRightSafeArea
            headerFadeInThreshold={0.2}
            disableLargeHeaderFadeAnim
            contentContainerStyle={[{ paddingBottom: tabBarMargin }]}
            renderItem={() =>
              activeTab === 'On-Chain Social ID' ? (
                <>
                  <View style={tw.style(`flex flex-row justify-between px-4 py-4`)}>
                    <View style={tw`flex flex-col gap-1`}>
                      <Text style={tw`text-[28px] font-bold text-white`}>{userData?.name}</Text>
                      <Text style={tw`text-[#ffffff99] text-xs`}>@{userData?.handle}</Text>
                    </View>

                    <Pressable
                      style={tw`w-8 h-8 rounded-full justify-center items-center bg-[#684FCD]`}
                      onPress={onEditPress}
                      hitSlop={30}>
                      <Image
                        style={tw`w-5 h-5`}
                        source={require('@/assets/images/profile/edit.png')}
                      />
                    </Pressable>
                  </View>
                  <Accordion
                    sections={sections}
                    activeSections={activeSections}
                    onAccordionChange={onAccordionChange}
                  />
                </>
              ) : (
                <View style={tw`px-4`}>
                  <LinearGradient
                    start={[0, 0.4]}
                    end={[0.2, 0.7]}
                    colors={['#63ADEF', '#4E35B1']}
                    style={tw`flex-1 rounded-3xl pl-[1px] pt-[1px]`}>
                    <View style={tw`bg-[#3445b4] rounded-3xl flex-col gap-2 pt-0 pb-4`}>
                      <ItemsCarousel data={userItems} setActiveIndex={setActiveItemIndex} />
                      <View style={tw`bg-transparent flex-col gap-4 px-4`}>
                        {Object.values(userItems)[activeItemIndex].data?.map((item) => (
                          <LinearGradient
                            key={item.token_id}
                            colors={['transparent', 'transparent']}
                            style={tw`w-full flex-1 pr-2 rounded-[20px] flex items-center justify-center flex-row gap-2 bg-[#c5c5c548]`}>
                            <Image
                              style={tw`w-[82px] h-[69px]`}
                              source={{ uri: item.content.preview.url }}
                            />
                            <View style={tw`flex-1 flex-col gap-1.5 w-full`}>
                              <Text
                                style={tw`text-lg text-white font-semibold`}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {item.name}
                              </Text>
                              <Text style={tw`text-[13px] text-white`}>{item.description}</Text>
                            </View>
                          </LinearGradient>
                        ))}
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )
            }
            stickySectionHeadersEnabled
          />
        </BlurView>
      </LinearGradient>
      {!isUserDataLoading && <ProfileEdit ref={bottomModalRef} />}
    </>
  );
};
