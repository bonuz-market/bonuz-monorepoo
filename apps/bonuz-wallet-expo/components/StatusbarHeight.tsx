import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function StatusBarHeight () {
    const insets = useSafeAreaInsets();
    const statusBarHeight = insets.top;

  return statusBarHeight;
}