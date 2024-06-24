import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { Shadow } from 'react-native-shadow-2';
import tw from 'twrnc';

import { useUiStore } from '@/store/ui';

const TabBar = ({ state, descriptors, navigation }: any) => {
  const isTabBarHidden = useUiStore((state) => state.isTabBarHidden);

  if (isTabBarHidden) {
    return;
  }

  return (
    <View style={tw`flex-row justify-center items-center absolute bottom-4 left-0 right-0`}>
      <BlurView
        intensity={35}
        style={[
          tw`flex-row gap-[30px] justify-center items-center overflow-hidden px-4 py-3 rounded-full`,
        ]}>
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
            <Shadow
              distance={3}
              startColor={'rgba(255, 163, 78, 0.60)'}
              endColor={'rgba(206, 9, 255, 0.45)'}
              style={tw`rounded-[28px] overflow-hidden`}
              disabled={!isFocused}
              key={route.key}>
              <Pressable onPress={onPress} style={tw`items-center`}>
                <LinearGradient
                  colors={isFocused ? ['#0E2875', '#4B2EA2'] : ['transparent', 'transparent']}
                  style={tw`p-3 rounded-full`}>
                  {label === 'home' && (
                    <Iconify icon="fluent:home-20-regular" color="#fff" size={28} />
                  )}
                  {label === '(scan)' && (
                    <Iconify icon="iconamoon:scanner-thin" color="#fff" size={28} />
                  )}

                  {label === '(profile)' && (
                    <Iconify icon="ph:user-circle-light" color="#fff" size={28} />
                  )}
                </LinearGradient>
              </Pressable>
            </Shadow>
          );
        })}
      </BlurView>
    </View>
  );
};

export default TabBar;
