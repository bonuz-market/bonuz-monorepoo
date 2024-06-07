import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import { Text, View } from '@/components/Themed';
import { useBottomTabBarMargin } from '@/hooks/useBottomTabBarHeight';

const walletMockData = {
  address: '0x71A0...6a6a',
  balance: '13,941,41',
};

export default function Cart() {
  const tabBarMargin = useBottomTabBarMargin();
  const { navigate } = useRouter();

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={[styles.container]}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View style={[styles.header, { paddingTop: StatusBarHeight() }]}>
        <TouchableOpacity onPress={() => navigate('/home')}>
          <View style={styles.headerImageWrap}>
            <Image
              style={styles.headerImage}
              source={require('@/assets/images/cart/leftIcon.png')}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.cartLogo]}>
          <Text style={styles.cartTitle}>Smart Wallet</Text>
          <View style={styles.networkSection}>
            <Image
              style={styles.worldIcon}
              source={require('@/assets/images/cart/worldIcon.png')}
            />
            <Text style={styles.caption}>All Networks</Text>
            <Image style={styles.downImage} source={require('@/assets/images/cart/downIcon.png')} />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigate('/cart')}>
          <View style={styles.headerImageWrap}>
            <Image
              style={styles.headerImage}
              source={require('@/assets/images/cart/compassIcon.png')}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          paddingBottom: tabBarMargin,
        }}
        style={styles.scrollContainer}>
        <ImageBackground
          source={require('@/assets/images/cart/walletBackground.png')}
          style={styles.carousel}>
          <View style={styles.walletContainer}>
            <Text style={styles.walletTitle}>Main Wallet</Text>
            <Text style={styles.walletBalance}>{walletMockData.address}</Text>
            <View style={styles.walletBalanceSection}>
              <Text style={styles.voucher}>$ {walletMockData.balance}</Text>
              <Image style={styles.eyeIcon} source={require('@/assets/images/cart/eyeIcon.png')} />
            </View>
            <View style={styles.optionSection}>
              <View style={styles.subOptionSection}>
                <Image
                  style={styles.optionIcon}
                  source={require('@/assets/images/cart/receive.png')}
                />
                <Text style={styles.optionText}>Receive</Text>
              </View>
              <View style={styles.subOptionSection}>
                <Image
                  style={styles.optionIcon}
                  source={require('@/assets/images/cart/swap.png')}
                />
                <Text style={styles.optionText}>Swap</Text>
              </View>
              <View style={styles.subOptionSection}>
                <Image
                  style={styles.optionIcon}
                  source={require('@/assets/images/cart/send.png')}
                />
                <Text style={styles.optionText}>Send</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5137B1',
    height: hp(16),
    borderBottomRightRadius: wp(10),
    borderBottomLeftRadius: wp(10),
  },
  cartLogo: {
    display: 'flex',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 600,
  },
  networkSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    gap: 4,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  worldIcon: {
    width: 20,
    height: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  headerLogo: {
    width: wp(22),
    height: wp(6),
  },
  eyeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: wp(6),
    height: wp(5),
  },
  searchImage: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(2),
  },
  downImage: {
    width: 10,
    height: 5.83,
  },
  headerImageWrap: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#684FCD',
  },
  badge: {
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: wp(8),
    borderRadius: 50,
    width: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(2.5),
  },
  badgeText: {
    fontSize: RFPercentage(1.5),
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginVertical: hp(2),
    paddingHorizontal: wp(5),
    justifyContent: 'space-between',
  },
  search: {
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5F42BE',
    width: wp(75),
    height: wp(12),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#7651CD',
  },
  input: {
    fontSize: RFPercentage(2),
    fontWeight: '400',
    color: 'white',
    width: wp(60),
  },
  carousel: {
    height: '100%',
    width: wp(90),
    borderRadius: wp(7),
    left: wp(5),
    flexDirection: 'row',
    overflow: 'hidden',
  },
  info: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(5),
  },
  optionSection: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    padding: wp(4),
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp(18),
  },
  subOptionSection: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    textAlign: 'center',
    gap: 2,
  },
  optionIcon: {
    width: 54,
    height: 54,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'normal',
  },
  walletContainer: {
    backgroundColor: 'transparent',
    width: '50%',
    height: '100%',
    padding: wp(5),
  },
  reward: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardImage: {
    width: wp(14),
    height: wp(14),
  },
  walletTitle: {
    fontSize: RFPercentage(2.8),
    color: 'white',
    fontWeight: 'bold',
  },
  walletBalanceSection: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
  },
  walletBalance: {
    fontSize: RFPercentage(2),
    color: 'white',
    fontWeight: 'normal',
  },
  voucher: {
    fontSize: RFPercentage(2.7),
    color: 'white',
    fontWeight: 'bold',
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  subVoucher: {
    fontSize: RFPercentage(2.2),
    color: 'white',
  },
  yourItemsImage: {
    width: wp(40),
    height: hp(25),
    resizeMode: 'contain',
  },
  viewAll: {
    backgroundColor: '#63ADEF30',
    marginRight: wp(5),
    borderRadius: 100,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.3),
  },
  viewAllText: {
    fontSize: RFPercentage(1.8),
    color: 'white',
    fontWeight: '600',
  },
  eventContainer: {
    marginTop: hp(2),
  },
  scrollContainer: {
    flex: 1,
    marginTop: hp(4),
  },
});
