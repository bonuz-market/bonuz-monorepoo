import { Pressable, Text, View } from 'react-native';
import {
  Avatar,
  AvatarProps,
  BubbleProps,
  MessageImage,
  MessageText,
  Time,
  utils,
} from 'react-native-gifted-chat';
import tw from 'twrnc';

const { isSameUser, isSameDay } = utils;

export const Bubble = (props: BubbleProps<any>) => {
  const { currentMessage } = props;

  const renderMessageText = () => {
    if (currentMessage.text) {
      const { containerStyle, wrapperStyle, renderMessageText, optionTitles, ...messageTextProps } =
        props;
      if (renderMessageText) {
        return renderMessageText(messageTextProps);
      }

      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [tw`text-white text-sm m-0`],
            right: [tw`text-white text-sm m-0`],
          }}
        />
      );
    }
  };

  const renderUsername = () => {
    const username = currentMessage.user.name;

    const onPressUsername = (props as AvatarProps<any>).onPressAvatar;
    if (username) {
      return (
        <Pressable onPress={() => onPressUsername?.(props.currentMessage?.user)}>
          <Text style={tw`text-[#FA3F7D] text-[13px] font-semibold`}>{username}</Text>
        </Pressable>
      );
    }
  };

  const renderTime = () => {
    if (currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, textStyle, renderTime, ...timeProps } = props;
      if (renderTime) {
        return renderTime(timeProps);
      }

      return (
        <Time
          {...timeProps}
          timeTextStyle={{
            left: [tw`text-xs text-[rgba(255,255,255,0.7)]`],
            right: [tw`text-xs text-[rgba(255,255,255,0.7)]`],
          }}
        />
      );
    }
  };

  const styles = {
    left: {
      containerToNext: tw`rounded-bl`,
      containerToPrevious: tw`rounded-tl`,
    },
    right: {
      containerToNext: tw`rounded-br`,
      containerToPrevious: tw`rounded-tr`,
    },
  };

  const styledBubbleToNext = () => {
    const { currentMessage, nextMessage, position, containerToNextStyle } = props;
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    ) {
      return [
        styles[position].containerToNext,
        containerToNextStyle && containerToNextStyle[position],
      ];
    }
  };

  const styledBubbleToPrevious = () => {
    const { currentMessage, previousMessage, position, containerToPreviousStyle } = props;
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    ) {
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ];
    }
  };

  const renderCustomView = () => {
    if (props.renderCustomView) {
      return props.renderCustomView(props);
    }
  };

  const messageHeader = <View style={tw`mb-1`}>{renderUsername()}</View>;
  const isCurrentUser = props.currentMessage?.user._id === props.user?._id;
  return (
    <Pressable
      style={[
        tw`flex-col w-full gap-0.5`,
        isCurrentUser && tw`bg-[#3759f8] w-full ml-auto p-2.5 rounded-xl`,
        !isCurrentUser && tw`bg-[#2b389e] w-full p-2.5 rounded-xl`,
        styledBubbleToNext(),
        styledBubbleToPrevious(),
      ]}
      onPress={() => props.onPress?.(undefined, props.currentMessage)}>
      {renderCustomView()}
      {messageHeader}
      {renderMessageText()}
      {renderTime()}
    </Pressable>
  );
};

export default Bubble;
