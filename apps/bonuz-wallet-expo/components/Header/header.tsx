import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

export const Header = ({
  left,
  right,
  title,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
  title?: React.ReactNode;
}) => {
  const { top } = useSafeAreaInsets();
  const Wrapper = title ? BlurView : View;
  return (
    <Wrapper
      style={[tw`flex-1 w-full pb-4 px-4 rounded-b-[30px] overflow-hidden`, { paddingTop: top }]}
      intensity={50}
      tint="light">
      <View
        style={[
          tw`flex-row flex-1 h-full items-center bg-transparent justify-center`,
          !title && tw`justify-between`,
        ]}>
        {left}
        {title && (
          <View
            style={[
              tw`flex-1`,
              !!left &&
                !right && {
                  transform: [{ translateX: -24 }],
                },
              !!right &&
                !left && {
                  transform: [{ translateX: 24 }],
                },
            ]}>
            {title}
          </View>
        )}
        {right}
      </View>
    </Wrapper>
  );
};
