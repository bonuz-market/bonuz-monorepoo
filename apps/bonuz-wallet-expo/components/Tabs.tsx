import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

export const Tabs = <T extends string>({
  value,
  onValueChange,
  tabs,
}: {
  value: T;
  onValueChange: (value: T) => void;
  tabs: T[];
}) => {
  const onChange = (title: T) => {
    onValueChange(title);
  };

  return (
    <View style={tw`flex h-[48px] bg-[#413DAB] rounded-[50px] p-1 flex-row`}>
      {tabs.map((title, index) => (
        <Pressable
          key={index}
          onPress={() => onChange(title)}
          style={[
            tw`flex-1 h-full rounded-full justify-center items-center`,
            value === title ? tw`bg-white` : tw`bg-transparent`,
          ]}>
          <Text
            style={[
              tw`font-semibold text-[16px]`,
              value === title ? tw`text-black` : tw`text-white`,
            ]}>
            {title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
