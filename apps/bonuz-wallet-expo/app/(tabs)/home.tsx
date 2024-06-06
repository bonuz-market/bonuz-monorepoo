import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import HomeCarousel from '@/components/HomeCarousel';
import { StatusBarHeight } from '@/components/StatusbarHeight';
import { Text, View } from '@/components/Themed';
import { useBottomTabBarMargin } from '@/hooks/useBottomTabBarHeight';

export default function Home() {
  const [yourItemIndex, setYourItemIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const tabBarMargin = useBottomTabBarMargin();
  const { navigate } = useRouter();

  let yourItemsArray = [0, 1, 2];
  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={[styles.container]}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View style={[styles.header, { paddingTop: StatusBarHeight() }]}>
        <View style={styles.headerImageWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>99+</Text>
          </View>
          <Image style={styles.headerImage} source={require('@/assets/images/home/profile.png')} />
        </View>
        <Image style={styles.headerLogo} source={require('@/assets/images/home/logo.png')} />
        <TouchableOpacity onPress={() => navigate('/cart')}>
          <View style={styles.headerImageWrap}>
            <Image style={styles.headerImage} source={require('@/assets/images/home/cart.png')} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.headerImageWrap}>
          <Image style={styles.headerImage} source={require('@/assets/images/home/filter.png')} />
        </View>
        <View style={styles.search}>
          <Image style={styles.searchImage} source={require('@/assets/images/home/search.png')} />
          <TextInput
            placeholderTextColor={'#BAB3E2'}
            placeholder="Search events, shops, communities..."
            style={styles.input}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarMargin }}
        style={styles.scrollContainer}>
        <HomeCarousel
          title={'Your Items'}
          badgeCount={99}
          right={<Image style={styles.info} source={require('@/assets/images/home/info.png')} />}
          data={yourItemsArray}
          item={
            <LinearGradient colors={['#F14375', '#F67640']} style={styles.carousel}>
              <View style={styles.rewardContainer}>
                <View style={styles.reward}>
                  <Image
                    style={styles.rewardImage}
                    source={require('@/assets/images/home/rewards.png')}
                  />
                </View>
                <Text style={styles.voucher}>Vouchers</Text>
                <Text style={styles.subVoucher}>2 Items</Text>
              </View>
              <Image
                style={styles.yourItemsImage}
                source={require('@/assets/images/home/yourItems.png')}
              />
            </LinearGradient>
          }
          setActiveIndex={setYourItemIndex}
          activeIndex={yourItemIndex}
        />
        <HomeCarousel
          title={'Events'}
          end={[0.6, 0.4]}
          start={[0.8, 0.7]}
          badgeCount={99}
          style={styles.eventContainer}
          right={
            <View style={styles.viewAll}>
              <Text style={styles.viewAllText}>View All</Text>
            </View>
          }
          data={yourItemsArray}
          item={
            <LinearGradient colors={['#F14375', '#F67640']} style={styles.carousel}>
              <View style={styles.rewardContainer}>
                <View style={styles.reward}>
                  <Image
                    style={styles.rewardImage}
                    source={require('@/assets/images/home/rewards.png')}
                  />
                </View>
                <Text style={styles.voucher}>Vouchers</Text>
                <Text style={styles.subVoucher}>2 Items</Text>
              </View>
              <Image
                style={styles.yourItemsImage}
                source={require('@/assets/images/home/yourItems.png')}
              />
            </LinearGradient>
          }
          setActiveIndex={setEventIndex}
          activeIndex={eventIndex}
        />
        <HomeCarousel
          title={'Food'}
          end={[0.6, 0.4]}
          start={[0.8, 0.7]}
          badgeCount={99}
          style={styles.eventContainer}
          right={
            <View style={styles.viewAll}>
              <Text style={styles.viewAllText}>View All</Text>
            </View>
          }
          data={yourItemsArray}
          item={
            <LinearGradient colors={['#F14375', '#F67640']} style={styles.carousel}>
              <View style={styles.rewardContainer}>
                <View style={styles.reward}>
                  <Image
                    style={styles.rewardImage}
                    source={require('@/assets/images/home/rewards.png')}
                  />
                </View>
                <Text style={styles.voucher}>Vouchers</Text>
                <Text style={styles.subVoucher}>2 Items</Text>
              </View>
              <Image
                style={styles.yourItemsImage}
                source={require('@/assets/images/home/yourItems.png')}
              />
            </LinearGradient>
          }
          setActiveIndex={setEventIndex}
          activeIndex={eventIndex}
        />
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
  headerLogo: {
    width: wp(22),
    height: wp(6),
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
    left: -wp(10),
    flexDirection: 'row',
  },
  info: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(5),
  },
  rewardContainer: {
    backgroundColor: 'transparent',
    width: '50%',
    height: '100%',
    padding: wp(5),
  },
  reward: {
    backgroundColor: '#f67868',
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardImage: {
    width: wp(14),
    height: wp(14),
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
  },
});
