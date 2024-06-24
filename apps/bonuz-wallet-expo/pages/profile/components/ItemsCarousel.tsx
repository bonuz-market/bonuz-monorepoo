import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ImageSourcePropType, Text, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import tw from 'twrnc';

interface ItemsCarouselProps {
  data: {
    title: string;
    subtitle: string;
    image: ImageSourcePropType;
    gradient: string[];
  }[];
  setActiveIndex: (index: number) => void;
}

export const ItemsCarousel = ({ data, setActiveIndex }: ItemsCarouselProps) => {
  const progress = useSharedValue<number>(0);

  const window = useWindowDimensions();
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
    <View style={tw`flex-col gap-1`}>
      <Carousel
        mode="parallax"
        data={data}
        scrollAnimationDuration={500}
        onProgressChange={progress}
        modeConfig={{
          parallaxScrollingOffset: 200,
          // parallaxAdjacentItemScale: 0.9,
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item, index }) => (
          <LinearGradient
            colors={item.gradient}
            style={tw`w-full rounded-[20px] p-3 flex items-center justify-center`}>
            <View style={tw`bg-transparent flex-row gap-2 items-center`}>
              <View
                style={tw`bg-[rgba(255,255,255,0.2)] p-3 rounded-full justify-center items-center`}>
                <Image style={tw`w-[56px] h-[56px]`} source={item.image} />
              </View>
              <View style={tw`flex-col gap-1.5`}>
                <Text style={tw`text-base text-white font-semibold`}>{item.title}</Text>
                <Text style={tw`text-[13px] text-white`}>{item.subtitle}</Text>
              </View>
            </View>
          </LinearGradient>
        )}
        width={PAGE_WIDTH - 16 * 2}
        height={90}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={tw`w-2 h-2 rounded-full bg-[rgba(255,255,255,0.5)]`}
        //   NOT YET IMPLEMENTED
        activeDotStyle={tw`bg-white`}
        containerStyle={tw`gap-2`}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
};
