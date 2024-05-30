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
  const { data } = useQueryGetUserProfileAndSocialLinks();

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
        <View style={styles.listRow}>
          <View
            style={[
              styles.listIconWrap,
              { backgroundColor: SECTIONS.SOCIALS_MEDIA_ACCOUNTS.background },
            ]}>
            <Image
              source={SECTIONS.SOCIALS_MEDIA_ACCOUNTS.icon}
              style={styles.listIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.listTitle} numberOfLines={1}>
            {SECTIONS.SOCIALS_MEDIA_ACCOUNTS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View>
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

                // text={item.handle}
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
              <View style={{ height: 10, backgroundColor: '#303db4' }} />
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
        <View style={styles.listRow}>
          <View style={[styles.listIconWrap, { backgroundColor: SECTIONS.WALLETS.background }]}>
            <Image source={SECTIONS.WALLETS.icon} style={styles.listIcon} resizeMode="contain" />
          </View>
          <Text style={styles.listTitle} numberOfLines={1}>
            {SECTIONS.WALLETS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View>
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

                //   text={item.handle}
                //   RightComponent={
                //     <HStack space={1} alignItems="center">
                //       <Ionicons
                //         name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
                //         color="white"
                //         size={20}
                //       />
                //     </HStack>
                //   }
                //   isVerified={item.isVerified}
              />
            )}
            keyExtractor={(item) => item.type}
            ItemSeparatorComponent={() => (
              <View style={{ height: 10, backgroundColor: '#303db4' }} />
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
        <View style={styles.listRow}>
          <View
            style={[styles.listIconWrap, { backgroundColor: SECTIONS.MESSAGING_APPS.background }]}>
            <Image
              source={SECTIONS.MESSAGING_APPS.icon}
              style={styles.listIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.listTitle} numberOfLines={1}>
            {SECTIONS.MESSAGING_APPS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View>
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
                //   RightComponent={
                //     <HStack space={1} alignItems="center">
                //       <Ionicons
                //         name={item.isPublic ? 'eye-outline' : 'eye-off-outline'}
                //         color="white"
                //         size={20}
                //       />
                //     </HStack>
                //   }
                //   isVerified={item.isVerified}
              />
            )}
            keyExtractor={(item) => item.type}
            ItemSeparatorComponent={() => (
              <View style={{ height: 10, backgroundColor: '#303db4' }} />
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
        <View style={styles.listRow}>
          <View
            style={[
              styles.listIconWrap,
              { backgroundColor: SECTIONS.DECENTRALIZED_IDENTIFERS.background },
            ]}>
            <Image
              source={SECTIONS.DECENTRALIZED_IDENTIFERS.icon}
              style={styles.listIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.listTitle} numberOfLines={1}>
            {SECTIONS.DECENTRALIZED_IDENTIFERS.title}
          </Text>
        </View>
      ),
      renderContent: (
        <View>
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

                // RightComponent={
                //   <HStack space={1} alignItems="center">
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
              <View style={{ height: 10, backgroundColor: '#303db4' }} />
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
    bottomModalRef.current?.present();
  };

  return isNotEmpty(auth) && isNotEmpty(user) ? (
    <View style={tw`flex-1`}>
      <LinearGradient colors={['#4B2EA2', '#0E2875']} style={styles.container}>
        <ImageBackground
          source={
            data?.profilePicture
              ? { uri: data.profilePicture }
              : require('@/assets/images/profile/profile.png')
          }
          style={styles.profile}>
          <View
            style={[
              styles.header,
              {
                paddingTop:
                  Platform.OS === 'android' ? StatusBarHeight() + hp(2) : StatusBarHeight(),
              },
            ]}>
            <Pressable onPress={handleLogout} style={styles.headerImageWrap}>
              <Image
                style={styles.headerImage}
                source={require('@/assets/images/profile/settings.png')}
              />
            </Pressable>
            <View style={styles.headerImageWrap}>
              <Image
                style={styles.headerImage}
                source={require('@/assets/images/profile/share.png')}
              />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.listHeader}>
          <BlurView
            intensity={Platform.OS === 'ios' ? 25 : 10}
            tint={Platform.OS === 'ios' ? 'light' : 'dark'}
            experimentalBlurMethod="dimezisBlurView"
            style={styles.absolute}>
            <View style={styles.blur}>
              <Text style={styles.socialId}>On-Chain Social ID</Text>
            </View>
            <View style={styles.rowContainer}>
              <View style={{ backgroundColor: 'transparent' }}>
                <Text style={styles.name}>{data?.name}</Text>
                <Text style={styles.userName}>{data?.handle}</Text>
              </View>
              <Pressable style={styles.editImageWrap} onPress={onEditPress}>
                <Image
                  style={styles.editImage}
                  source={require('@/assets/images/profile/edit.png')}
                />
              </Pressable>
            </View>
            <Accordion
              sections={sections}
              activeSections={activeSections}
              onAccordionChange={onAccordionChange}
            />
          </BlurView>
        </View>
      </LinearGradient>
      <ProfileEdit ref={bottomModalRef} />
    </View>
  ) : (
    <LinearGradient
      colors={['#4B2EA2', '#0E2875']}
      style={[styles.container, styles.guestContainer]}>
      <Text style={styles.guestText}>You are guest please login to continue</Text>
      <TouchableOpacity
        onPress={() => login({ provider: 'google' })}
        style={[styles.button, styles.buttonSocial]}>
        <Image
          source={require('@/assets/images/google.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => login({ provider: 'apple' })} style={styles.button}>
        <Image
          source={require('@/assets/images/apple.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Sign Up with Apple</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  guestContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    fontSize: RFPercentage(2),
    color: 'white',
    fontWeight: '500',
    marginBottom: hp(5),
  },
  buttonText: {
    color: '#000',
    fontSize: RFPercentage(2),
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: hp(6),
    width: wp(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  icon: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(3),
  },
  buttonSocial: {
    marginBottom: hp(1),
  },
  container: {
    flex: 1,
  },
  listIconWrap: {
    height: hp(4.5),
    width: hp(4.5),
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  listTitle: {
    fontSize: RFPercentage(2),
    color: 'white',
    fontWeight: '500',
    marginLeft: wp(4),
    width: wp(55),
  },
  listIcon: {
    height: hp(3),
    width: hp(3),
  },
  listDown: {
    height: hp(3.5),
    width: hp(3.5),
  },
  listHeader: {
    height: hp(62),
    top: hp(-7),
    backgroundColor: 'transparent',
  },
  blur: {
    backgroundColor: 'transparent',
    height: hp(7),
    justifyContent: 'center',
    width: wp(100),
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    padding: wp(5),
  },
  name: {
    fontSize: RFPercentage(3),
    color: 'white',
    fontWeight: '700',
  },
  userName: {
    fontSize: RFPercentage(1.8),
    color: '#D5D7E6',
    marginTop: hp(0.6),
  },
  editImageWrap: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#684FCD',
  },
  editImage: {
    width: wp(5),
    height: wp(5),
  },
  absolute: {
    overflow: 'hidden',
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  socialId: {
    fontSize: RFPercentage(2),
    color: 'white',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  profile: {
    width: wp(100),
    height: hp(45),
    zIndex: 0,
  },
  headerImage: {
    width: wp(6),
    height: wp(5),
  },
  headerImageWrap: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9A08F',
  },
});
