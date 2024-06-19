import * as React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import tw from 'twrnc';

const colors = ['#26292E', '#899F9C', '#B3C680', '#5C6265', '#F5D399', '#F1F1F1'];

interface HomeBannerProps {
  data: { image: any }[];
}
export const HomeBanner = ({ data }: HomeBannerProps) => {
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

  const autoPlay = true;

  return (
    <View style={tw`h-[130px]`}>
      <Carousel
        ref={ref}
        width={PAGE_WIDTH}
        height={120}
        loop
        pagingEnabled={false}
        autoPlay={autoPlay}
        autoPlayInterval={1500}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={data}
        renderItem={({ item }) => <Image style={tw`w-full flex-1`} source={item.image} />}
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
