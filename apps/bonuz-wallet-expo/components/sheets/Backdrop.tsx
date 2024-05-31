import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

export const CustomBackdrop = ({
  animatedIndex,
  style,
  animatedPosition,
  minOpacity = 0,
}: BottomSheetBackdropProps & {
  minOpacity?: number;
}) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#117EFF50',
      },
      containerAnimatedStyle,
    ],
    [containerAnimatedStyle, style],
  );

  return (
    <Animated.View style={containerStyle}>
      <BottomSheetBackdrop
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    </Animated.View>
  );
};
