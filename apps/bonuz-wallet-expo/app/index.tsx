import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  FlatList,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/hooks/Auth.hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function OnBoarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user, login, logout } = useAuth();
  const scrollViewReference = useRef(null);
  const bottomSheetModalReference = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const snapPoints = useMemo(() => ['5%', '40%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalReference.current?.present();
  }, []);
  const onboardingData = [
    {
      image: require('@/assets/images/onboardingOne.png'),
      title: 'Welcome to your On-chain Social Wallet',
      description:
        'Add your social media links to your profile so new friends can easily connect to you',
    },
    {
      image: require('@/assets/images/onboardingTwo.png'),
      title: 'Make new friends while exploring new events',
      description: 'Use QR-code to add a new connections',
    },
    {
      image: require('@/assets/images/onboardingThree.png'),
      title: 'Earn exclusive rewards by participating in challenges',
      description: 'Secure vouchers, discounts, certificates and more from Bonuz partners',
    },
    {
      image: require('@/assets/images/onboardingFour.png'),
      title: 'Connect to Apps & Dapps using your wallet',
      description:
        'Seamlessly access and use your favorite Web3 applications directly from the integrated wallet interface',
    },
  ];

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const loggedIn = await SecureStore.getItemAsync('loggedIn');
        if (loggedIn !== null) {
          login(JSON.parse(loggedIn));
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        return;
      }
    };
    retrieveToken();

    return () => {};
  }, [login]);

  const handleNext = () => {
    if (activeIndex === 3) {
      return handlePresentModalPress();
    } else {
      const nextIndex = activeIndex + 1;
      if (scrollViewReference.current) {
        scrollViewReference.current.scrollToIndex({
          animated: true,
          index: nextIndex, // Loop to the first item after reaching the last one
        });
        setActiveIndex(nextIndex);
      }
    }
  };

  const handleTitle = () => {
    if (activeIndex === 0) {
      return 'Continue';
    } else if (activeIndex === 3) {
      return 'Connect Decentralized ID';
    } else {
      return 'Next';
    }
  };

  const handleLogin = async (provider: string) => {
    let loginState = {
      jwt: 'dsgfhddfghdfg',
      socialProvider: provider,
      guest: false,
      isLoggedIn: true,
    };
    login(loginState);
    try {
      await SecureStore.setItemAsync('loggedIn', JSON.stringify(loginState));
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.description}</Text>
      </View>
    );
  };

  if (user?.jwt || user?.guest) return <Redirect href={'/(tabs)/profile'} />;

  return (
    <BottomSheetModalProvider>
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.container}>
        <View style={styles.scrollContainer}>
          <View style={styles.pagination}>
            {activeIndex !== 0 &&
              onboardingData.map((_, index) => {
                return index === 0 ? undefined : (
                  <View
                    key={index}
                    style={[styles.paginationDot, index <= activeIndex && styles.activeDot]}
                  />
                );
              })}
          </View>

          <FlatList
            ref={scrollViewReference}
            data={onboardingData}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            initialNumToRender={5}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(
                Math.floor(event.nativeEvent.contentOffset.x) /
                  Math.floor(event.nativeEvent.layoutMeasurement.width),
              );
              setActiveIndex(index);
            }}
          />
        </View>
        <View style={styles.buttonWrap}>
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>{handleTitle()}</Text>
          </TouchableOpacity>
          {activeIndex === 3 && (
            <Text onPress={() => login({ ...user, guest: true })} style={styles.guest}>
              Continue as guest
            </Text>
          )}
        </View>
      </ImageBackground>
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: 'transparent' }}
        ref={bottomSheetModalReference}
        handleIndicatorStyle={styles.indicator}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <LinearGradient
          colors={['#0E2875', '#4B2EA2']}
          style={{
            flex: 1,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            alignItems: 'center',
          }}>
          <Text style={styles.signUp}>Sign Up</Text>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => handleLogin('Google')}
            style={[styles.button, styles.buttonSocial]}>
            <Image
              source={require('@/assets/images/google.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Sign Up with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLogin('Apple')} style={styles.button}>
            <Image
              source={require('@/assets/images/apple.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Sign Up with Apple</Text>
          </TouchableOpacity>
        </LinearGradient>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
  },
  slide: {
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    height: hp(82),
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.5,
  },
  title: {
    fontSize: RFPercentage(3.2),
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
    textAlign: 'center',
    width: wp(75),
  },
  subtitle: {
    fontSize: RFPercentage(1.8),
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 40,
    color: '#FFFFFF60',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: hp(8),
    alignSelf: 'center',
  },
  paginationDot: {
    width: wp(10),
    height: hp(0.7),
    borderRadius: 5,
    backgroundColor: '#6F43D0',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  buttonWrap: {
    height: hp(15),
    width: wp(92),
    alignSelf: 'center',
    justifyContent: 'center',
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
  buttonSocial: {
    marginBottom: hp(1),
  },
  buttonText: {
    color: '#000',
    fontSize: RFPercentage(2),
    fontWeight: '600',
  },
  signUp: {
    color: '#fff',
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    marginTop: hp(4),
  },
  guest: {
    color: '#fff',
    fontSize: RFPercentage(1.8),
    fontWeight: '500',
    marginTop: hp(2),
    alignSelf: 'center',
  },
  logo: {
    width: wp(35),
    height: wp(28),
  },
  icon: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(3),
  },
  indicator: {
    backgroundColor: '#905CFF',
    top: hp(3),
    height: hp(0.6),
    width: wp(10),
  },
});
