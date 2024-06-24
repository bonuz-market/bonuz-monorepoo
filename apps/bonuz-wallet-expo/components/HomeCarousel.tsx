import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { ExpoRouter } from 'expo-router/types/expo-router';
import React from 'react';
import { ImageBackground, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import tw from 'twrnc';

interface HomeCarouselProps {
  title: string;
  right: JSX.Element;
  badgeCount: number;
  data: { image: string; title: string; href: ExpoRouter.Href }[];
  style?: any;
}

export default function HomeCarousel({ title, right, badgeCount, data, style }: HomeCarouselProps) {
  const window = useWindowDimensions();

  const progress = useSharedValue<number>(0);

  const PAGE_WIDTH = window.width;

  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <LinearGradient
      start={[0, 0.4]}
      end={[0.2, 0.7]}
      colors={['#63ADEF', '#4E35B1']}
      style={[tw`rounded-3xl p-[1px]`, style]}>
      <View style={tw`bg-[#4E35B1] rounded-3xl`}>
        <View style={tw`flex-row items-center justify-between w-full bg-transparent px-4 pt-2`}>
          <View style={tw`flex-row items-center bg-transparent gap-2`}>
            <Text style={tw`text-white font-bold text-xl`}>{title}</Text>
            <View style={tw`bg-[#63ADEF30] rounded-full w-6 justify-center items-center h-6 p-1`}>
              <Text style={tw`text-white font-bold text-sm`}>{badgeCount}</Text>
            </View>
          </View>
          {right}
        </View>
        <Carousel
          ref={ref}
          width={PAGE_WIDTH - 32}
          style={{ width: PAGE_WIDTH }}
          height={180}
          loop={false}
          pagingEnabled={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          data={data}
          onProgressChange={progress}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <Link href={item.href} asChild>
              <Pressable>
                <ImageBackground
                  style={tw`w-full h-full rounded-[20px] justify-end`}
                  imageStyle={tw`rounded-[20px]`}
                  height={170}
                  source={{ uri: item.image }}>
                  <Text style={tw`text-xl text-white font-semibold p-4`}>{item.title}</Text>
                </ImageBackground>
              </Pressable>
            </Link>
          )}
          onConfigurePanGesture={(g) => {
            g.activeOffsetX([-20, 20]);
            g.failOffsetY([-20, 20]);
          }}
        />
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={tw`w-2 h-2 rounded-full bg-[rgba(255,255,255,0.5)]`}
          //   NOT YET IMPLEMENTED
          activeDotStyle={tw`bg-white`}
          containerStyle={tw`gap-2 bottom-1`}
          horizontal
          onPress={onPressPagination}
        />
      </View>
    </LinearGradient>
  );
}
