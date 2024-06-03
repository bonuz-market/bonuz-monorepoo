import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_GUTTER = 8;

export const useBottomTabBarMargin = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomTabBarHeight = useBottomTabBarHeight();

  return bottomInset + bottomTabBarHeight + BOTTOM_GUTTER;
};
