import { Image, Pressable, View } from 'react-native';
import { Avatar, Day, MessageProps, utils } from 'react-native-gifted-chat';
import tw from 'twrnc';

import Bubble from './Bubble';

const { isSameUser, isSameDay } = utils;

export const Message = (props: MessageProps<any>) => {
  const getInnerComponentProps = () => {
    const { containerStyle, ...innerProps } = props;
    return {
      ...innerProps,
      position: 'left',
      isSameUser,
      isSameDay,
    } as any;
  };

  const renderDay = () => {
    if (props.currentMessage.createdAt) {
      const dayProps = getInnerComponentProps();
      if (props.renderDay) {
        return props.renderDay(dayProps);
      }

      return (
        <Day
          {...dayProps}
          wrapperStyle={tw`px-2 py-0.5 bg-[#2b389e] flex-1 rounded-[20px] self-center`}
          textStyle={tw`text-[rgba(255,255,255,0.7)]`}
        />
      );
    }

    return null;
  };

  const renderBubble = () => {
    const bubbleProps = getInnerComponentProps();
    if (props.renderBubble) {
      return props.renderBubble(bubbleProps);
    }

    return <Bubble {...bubbleProps} />;
  };

  const isCurrentUser = props.currentMessage.user._id === props.user._id;
  const marginBottom = isSameUser(props.currentMessage, props.nextMessage) ? 2 : 12;
  return (
    <View style={tw`flex-1`}>
      {renderDay()}
      <View
        style={[
          tw`flex-row flex-1 w-3/4 px-4`,
          { marginBottom },
          isCurrentUser && tw`self-end`,
          !isCurrentUser && tw`self-start`,
        ]}>
        {!isCurrentUser && (
          <Avatar
            {...getInnerComponentProps()}
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
        )}
        <View
          style={[
            isCurrentUser && tw`bg-[#3759f8] w-full ml-auto p-2.5 rounded-xl rounded-br-none`,
            !isCurrentUser &&
              tw`bg-[#2b389e] w-full p-2.5 rounded-xl rounded-bl-none flex-row gap-2`,
          ]}>
          {renderBubble()}
        </View>
      </View>
    </View>
  );
};

export default Message;
