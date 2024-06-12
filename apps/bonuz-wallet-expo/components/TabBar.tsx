import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import tw from 'twrnc';

import { useUiStore } from '@/store/ui';

const { width } = Dimensions.get('window');

const TabBar = ({ state, descriptors, navigation }: any) => {
  const isTabBarHidden = useUiStore((state) => state.isTabBarHidden);

  if (isTabBarHidden) {
    return;
  }

  return (
    <LinearGradient
      colors={['#263d9F1F', '#475CB41F']}
      style={[tw`flex-row absolute bottom-4 overflow-hidden`, { marginHorizontal: width * 0.2 }]}>
      <BlurView intensity={35} style={[tw`flex-1 flex-row rounded-full`]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel === undefined
              ? options.title === undefined
                ? route.name
                : options.title
              : options.tabBarLabel;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable onPress={onPress} key={index} style={[styles.mainItemContainer]}>
              <LinearGradient
                colors={isFocused ? ['#0E2875', '#4B2EA2'] : ['transparent', 'transparent']}
                style={{
                  borderRadius: 100,
                  padding: wp(2.5),
                }}>
                {label === 'home' && (
                  <Image style={styles.image} source={require('@/assets/images/home.png')} />
                )}
                {label === '(scan)' && (
                  <Image style={styles.qrImage} source={require('@/assets/images/qr.png')} />
                )}

                {label === '(profile)' && (
                  <Image style={styles.image} source={require('@/assets/images/profile.png')} />
                )}
              </LinearGradient>
            </Pressable>
          );
        })}
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    borderRadius: 100,
    marginHorizontal: width * 0.2,
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: wp(3),
    borderRadius: 1,
    shadowColor: '#E79413',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    // elevation: 4,
  },
  image: {
    width: wp(7),
    height: wp(7),
  },
  qrImage: {
    width: wp(14),
    height: wp(14),
  },
});

export default TabBar;
