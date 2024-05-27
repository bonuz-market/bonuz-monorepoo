import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface HomeCarouselProps {
  title: string;
  lineargradient?: string[];
  start?: [number, number];
  end?: [number, number];
  right: JSX.Element;
  badgeCount: number;
  item: JSX.Element;
  data: any[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  style?: any;
}
export default function HomeCarousel({
  title,
  lineargradient,
  start,
  end,
  right,
  badgeCount,
  item,
  data,
  activeIndex,
  setActiveIndex,
  style,
}: HomeCarouselProps) {
  return (
    <LinearGradient
      start={start || [0, 0.4]}
      end={end || [0.2, 0.7]}
      colors={lineargradient || ['#63ADEF', '#4E35B1']}
      style={[styles.itemLinear, style]}>
      <View style={styles.itemContainer}>
        <View style={styles.itemsHeader}>
          <View style={styles.yourItemsContainer}>
            <Text style={styles.yourItemText}>{title}</Text>
            <View style={styles.yourItemBadge}>
              <Text style={styles.yourItemBadgeText}>{badgeCount}+</Text>
            </View>
          </View>
          {right}
        </View>
        <Carousel
          width={wp(95)}
          height={hp(25)}
          loop={false}
          style={{ width: '100%' }}
          mode="parallax"
          data={data}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setActiveIndex(index)}
          renderItem={({ index }) => item}
        />
        <View style={styles.pagination}>
          {data.map((_, index) => {
            return (
              <View
                key={index}
                style={[styles.paginationDot, index === activeIndex && styles.activeDot]}
              />
            );
          })}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  itemLinear: {
    width: wp(90),
    height: hp(34),
    alignSelf: 'center',
    borderRadius: wp(6),
    padding: 1,
  },
  itemContainer: {
    backgroundColor: '#4E35B1',
    borderRadius: wp(6),
    paddingLeft: wp(5),
    paddingVertical: wp(5),
    flex: 1,
  },
  carousel: {
    height: '100%',
    width: wp(90),
    borderRadius: wp(7),
    left: -wp(10),
    flexDirection: 'row',
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'transparent',
  },
  yourItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  yourItemText: {
    fontSize: RFPercentage(2.5),
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  paginationDot: {
    width: hp(1),
    height: hp(1),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF30',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: wp(10),
    height: hp(1),
    borderRadius: 5,
  },
  yourItemBadge: {
    backgroundColor: '#63ADEF30',
    borderRadius: 50,
    width: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(2.5),
    marginLeft: 5,
  },
  yourItemBadgeText: {
    fontSize: RFPercentage(1.5),
    color: 'white',
    fontWeight: 'bold',
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
});
