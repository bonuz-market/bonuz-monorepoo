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
  const { currentMessage, user } = props;

  const getInnerComponentProps = () => {
    const { containerStyle, ...innerProps } = props;
    return {
      ...innerProps,
      position: 'left',
      isSameUser,
      isSameDay,
    } as BubbleProps<any>;
  };

  const renderMessageText = () => {
    if (currentMessage.text) {
      const { containerStyle, wrapperStyle, renderMessageText, ...messageTextProps } = props;
      if (renderMessageText) {
        return renderMessageText(messageTextProps);
      }

      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [tw`text-white text-sm m-0`],
          }}
          linkStyle={{
            left: [
              {
                fontFamily: 'Farro_400Regular',
                fontSize: 14,
                color: '#FFA34E',
              },
            ],
          }}
        />
      );
    }
    return null;
  };

  const renderMessageImage = () => {
    if (currentMessage.image) {
      const { containerStyle, wrapperStyle, renderMessageImage, ...messageImageProps } = props;
      if (renderMessageImage) {
        return renderMessageImage(messageImageProps);
      }

      return <MessageImage {...messageImageProps} />;
    }

    return null;
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

    return null;
  };

  const renderTime = () => {
    if (currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, renderTime, ...timeProps } = props;
      if (renderTime) {
        return renderTime(timeProps);
      }

      return (
        <Time
          {...timeProps}
          timeTextStyle={{
            left: [tw`text-xs text-[rgba(255,255,255,0.7)]`],
          }}
        />
      );
    }

    return null;
  };

  const renderCustomView = () => {
    if (props.renderCustomView) {
      return props.renderCustomView(props);
    }

    return null;
  };

  const messageHeader = <View style={tw`mb-1`}>{renderUsername()}</View>;

  return (
    <Pressable
      style={tw`flex-1 gap-0.5`}
      onPress={() => props.onPress?.(undefined, props.currentMessage)}>
      {renderCustomView()}
      {messageHeader}
      {renderMessageText()}
      {renderTime()}
    </Pressable>
  );
};

export default Bubble;
