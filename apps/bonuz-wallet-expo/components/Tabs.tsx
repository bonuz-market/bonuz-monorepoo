import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

export const Tabs = <T extends string>({
  value,
  onValueChange,
  tabs,
  style,
  activeStyle,
  textStyle,
  activeTextStyle,
  containerStyle,
}: {
  value: T;
  onValueChange: (value: T) => void;
  tabs: T[];
  style?: any;
  activeStyle?: any;
  textStyle?: any;
  activeTextStyle?: any;
  containerStyle?: any;
}) => {
  const onChange = (title: T) => {
    onValueChange(title);
  };

  const _containerStyle = containerStyle ?? tw` bg-[#413DAB]`;
  const _style = style ?? tw`bg-transparent`;
  const _activeStyle = activeStyle ?? tw`bg-white`;
  const _textStyle = textStyle ?? tw`text-white`;
  const _activeTextStyle = activeTextStyle ?? tw`text-black`;

  return (
    <View style={[tw`flex h-[48px] rounded-full p-1 flex-row gap-2`, _containerStyle]}>
      {tabs.map((title, index) => (
        <Pressable
          key={index}
          onPress={() => onChange(title)}
          style={[
            tw`flex-1 justify-center items-center`,
            value === title && tw`rounded-full`,
            value === title ? _activeStyle : _style,
          ]}>
          <Text
            style={[
              tw`font-semibold text-[16px]`,
              value === title ? _activeTextStyle : _textStyle,
            ]}>
            {title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
