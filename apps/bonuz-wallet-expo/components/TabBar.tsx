import React from 'react';
import { Pressable, Dimensions, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <LinearGradient colors={['#263d9F', '#475CB4']} style={styles.mainContainer}>
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
              <Image
                style={styles.image}
                source={
                  label === 'home'
                    ? require('@/assets/images/home.png')
                    : require('@/assets/images/profile.png')
                }
              />
            </LinearGradient>
          </Pressable>
        );
      })}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    borderRadius: 100,
    backgroundColor: 'red',
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
});

export default TabBar;
