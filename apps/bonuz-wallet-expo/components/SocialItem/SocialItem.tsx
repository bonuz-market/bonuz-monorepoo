import { ReactNode } from 'react';
import { View } from 'react-native';

interface SocialItemProps {
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  content: ReactNode;
}

export const SocialItem = ({ content, leftAddon, rightAddon }: SocialItemProps) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        height: 48,
        gap: 8,
        borderRadius: 12,
        backgroundColor: '#303db4',
        overflow: 'hidden',
      }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {leftAddon}
        {content}
      </View>
      {rightAddon}
    </View>
  );
};
