import { Image, Pressable, View } from 'react-native';
import { Avatar, Day, Message as IMessage, MessageProps, utils } from 'react-native-gifted-chat';
import tw from 'twrnc';

import Bubble from './Bubble';

const { isSameUser, isSameDay } = utils;

export const Message = (props: MessageProps<any>) => {
  const renderDay = () => {
    if (props.currentMessage.createdAt) {
      const { containerStyle, onMessageLayout, ..._props } = props;
      if (props.renderDay) {
        return props.renderDay(_props);
      }

      return (
        <Day
          {..._props}
          wrapperStyle={tw`px-2 py-0.5 bg-[#2b389e] rounded-[20px]`}
          textStyle={tw`text-[rgba(255,255,255,0.7)]`}
        />
      );
    }
  };

  const renderBubble = () => {
    const { containerStyle, onMessageLayout, ..._props } = props;

    if (props.renderBubble) {
      return props.renderBubble(_props);
    }

    return <Bubble {..._props} />;
  };

  const renderAvatar = () => {
    const { containerStyle, onMessageLayout, ..._props } = props;
    const isCurrentUser = props.currentMessage.user._id === props.user._id;

    return (
      !isCurrentUser && (
        <Avatar
          {..._props}
          renderAvatar={(props) => {
            return (
              <Pressable
                style={tw`mt-auto`}
                onPress={() => props.onPressAvatar?.(props.currentMessage?.user!)}
                onLongPress={() => props.onLongPressAvatar?.(props.currentMessage?.user!)}>
                <Image
                  source={
                    props.currentMessage?.user.avatar
                      ? { uri: props.currentMessage?.user.avatar }
                      : require('@/assets/images/profile/defaultAvatar.jpg')
                  }
                  style={tw`w-8 h-8 rounded-full`}
                />
              </Pressable>
            );
          }}
          renderAvatarOnTop={false}
          showAvatarForEveryMessage={false}
        />
      )
    );
  };

  const isCurrentUser = props.currentMessage.user._id === props.user._id;
  const marginBottom = isSameUser(props.currentMessage, props.nextMessage) ? 2 : 12;

  return (
    props.currentMessage && (
      <View onLayout={props.onMessageLayout}>
        {renderDay()}
        <View
          style={[
            tw`flex-row w-3/4 px-4`,
            { marginBottom },
            isCurrentUser && tw`self-end`,
            !isCurrentUser && tw`self-start`,
          ]}>
          {renderAvatar()}
          {renderBubble()}
        </View>
      </View>
    )
  );
};
