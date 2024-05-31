import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import tw from 'twrnc';
import { useShallow } from 'zustand/react/shallow';

import { Accordion, Section } from '@/components/Accordion/Accordion';
import { SocialItem } from '@/components/SocialItem/SocialItem';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import { Text, View } from '@/components/Themed';
import { useLogin } from '@/hooks/useLogin';
import { getIcon } from '@/pages/profile/profile.config';
import { ProfileEdit } from '@/pages/profile/sheets';
import { useQueryGetUserProfileAndSocialLinks } from '@/services/blockchain/bonuz/useSocialId';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

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

export default function Profile() {
  const { auth, user } = useUserStore(
    useShallow((store) => ({
      auth: store.auth,
      user: store.user,
    })),
  );

  const { logout, login } = useLogin();
  const { data, isLoading } = useQueryGetUserProfileAndSocialLinks();

  const bottomModalRef = useRef<BottomSheetModal>(null);

  const handleLogout = async () => {
    logout();

    router.push('/');
  };

  const [activeSections, setActiveSections] = useState([SECTIONS.SOCIALS_MEDIA_ACCOUNTS.index]);

  const socialsSection = useMemo<Section>(() => {
    const linksFiltered = Object.values(data?.socials ?? {}).filter((link) => !!link.handle);

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
                  <Text style={{ fontSize: 16, color: 'white', opacity: 0.7 }}>{item.handle}</Text>
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
  }, [data?.socials]);

  const walletsSection = useMemo<Section>(() => {
    const wallets = Object.values(data?.wallets ?? {}).filter((item) => !!item.handle);

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
  }, [data?.wallets]);

  const messagingAppsSection = useMemo<Section>(() => {
    const messagingApps = Object.values(data?.messagingApps ?? {}).filter((item) => !!item.handle);

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
  }, [data?.messagingApps]);

  const othersSection = useMemo<Section>(() => {
    const others = Object.values(data?.decentralizedIdentifiers ?? {}).filter(
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
  }, [data?.decentralizedIdentifiers]);
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
    if (isLoading) {
      return;
    }

    bottomModalRef.current?.present();
  };

  return isNotEmpty(auth) && isNotEmpty(user) ? (
    <View style={tw`flex-1`}>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
        <ImageBackground
          source={
            data?.profilePicture
              ? { uri: data.profilePicture }
              : require('@/assets/images/profile/profile.png')
          }
          style={tw.style(`w-full`, { height: hp(45) })}>
          <View
            style={tw.style(`flex-row justify-between items-center px-5 w-full bg-transparent`, {
              paddingTop: Platform.OS === 'android' ? StatusBarHeight() + hp(2) : StatusBarHeight(),
            })}>
            <Pressable
              onPress={handleLogout}
              style={tw`w-13 h-13 rounded-full justify-center items-center bg-[#E9A08F]`}>
              <Image style={tw`w-7 h-7`} source={require('@/assets/images/profile/settings.png')} />
            </Pressable>
            <View style={tw`w-13 h-13 rounded-full justify-center items-center bg-[#E9A08F]`}>
              <Image style={tw`w-7 h-7`} source={require('@/assets/images/profile/share.png')} />
            </View>
          </View>
          <BlurView
            intensity={Platform.OS === 'ios' ? 25 : 10}
            tint={Platform.OS === 'ios' ? 'light' : 'dark'}
            experimentalBlurMethod="dimezisBlurView"
            style={tw`absolute -bottom-5 rounded-t-full overflow-hidden w-full`}>
            <View
              style={tw`bg-transparent h-14 flex-1 justify-center w-[100%] rounded-t-3xl items-center`}>
              <Text style={tw`text-white text-base font-extrabold`}>On-Chain Social ID</Text>
            </View>
          </BlurView>
        </ImageBackground>
        <View style={tw`bg-transparent flex-1 gap-5 mt-6`}>
          <View style={tw`flex-row items-center justify-between bg-transparent px-4`}>
            <View style={tw`bg-transparent`}>
              <Text style={tw`text-white text-2xl font-extrabold`}>{data?.name}</Text>
              <Text style={tw`text-[#D5D7E6] text-sm mt-2`}>{data?.handle}</Text>
            </View>
            <Pressable
              style={tw`w-8 h-8 rounded-full justify-center items-center bg-[#684FCD]`}
              onPress={onEditPress}>
              <Image style={tw`w-5 h-5`} source={require('@/assets/images/profile/edit.png')} />
            </Pressable>
          </View>
          <Accordion
            sections={sections}
            activeSections={activeSections}
            onAccordionChange={onAccordionChange}
          />
        </View>
      </LinearGradient>
      {!isLoading && <ProfileEdit ref={bottomModalRef} />}
    </View>
  ) : (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-white text-base font-medium mb-20`}>
        You are guest please login to continue
      </Text>
      <TouchableOpacity
        onPress={() => login({ provider: 'google' })}
        style={[
          tw`flex-row bg-white h-24 w-72 justify-center items-center rounded-full`,
          tw`mb-4`,
        ]}>
        <Image
          source={require('@/assets/images/google.png')}
          style={tw`w-14 h-14 mr-6`}
          resizeMode="contain"
        />
        <Text style={tw`text-black text-base font-semibold`}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => login({ provider: 'apple' })}
        style={tw`flex-row bg-white h-24 w-72 justify-center items-center rounded-full`}>
        <Image
          source={require('@/assets/images/apple.png')}
          style={tw`w-14 h-14 mr-6`}
          resizeMode="contain"
        />
        <Text style={tw`text-black text-base font-semibold`}>Sign Up with Apple</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
