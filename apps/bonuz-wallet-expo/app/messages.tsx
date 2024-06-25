import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { useMutation } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { User as UserEntity } from '@/entities/user';
import { ConnectionSheet } from '@/pages/connections/sheets';
import {
  Message,
  renderComposer,
  RenderInputToolbar,
  renderSend,
} from '@/pages/messages/components';
import { sendMessage, useUserMessages } from '@/services/backend/messages';
import {
  useQueryGetUserProfileAndSocialLinksByHandle,
  useUserConnections,
} from '@/services/blockchain/bonuz/useSocialId';
import { useUserStore } from '@/store';

interface MessageType extends IMessage {
  user: {
    _id: number;
    name: string;
    handle: string;
    avatar?: string;
  };
}

const Messages = () => {
  const { user } = useUserStore((state) => ({
    user: state.user as UserEntity,
  }));

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [selectedUserHandle, setSelectedUserHandle] = React.useState<string>();

  const {
    data: messagesData,
    refetch: refetchMessages,
    fetchNextPage: fetchNextMessagesPage,
    hasNextPage: hasNextMessagesPage,
    isFetchingNextPage: isFetchingNextMessagesPage,
  } = useUserMessages({
    refetchOnMount: 'always',
  });
  const { data: selectedUserData, refetch: refetchConnections } =
    useQueryGetUserProfileAndSocialLinksByHandle({
      handle: selectedUserHandle,
    });

  const { data: userConnections } = useUserConnections();
  useEffect(() => {
    if (selectedUserData && selectedUserHandle) {
      bottomSheetModalRef.current?.present(selectedUserData);
    }
  }, [selectedUserData, selectedUserHandle]);

  const handleRemoveConnection = async () => {
    await refetchMessages();
    await refetchConnections();
  };

  const { mutateAsync: sendMessageAsync } = useMutation({
    mutationFn: ({ message }: { message: string }) => sendMessage(message),
    onSuccess: () => refetchMessages(),
  });

  const onSend = useCallback(
    async (messages: MessageType[] = []) => {
      await sendMessageAsync({
        message: messages[0].text,
      });
      ref.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    },
    [sendMessageAsync],
  );

  const headerHeight = useHeaderHeight();

  const messages = useMemo(
    () =>
      messagesData?.pages.map((message) => {
        const user = userConnections.find((user) => user.handle === message.user.handle);
        return {
          _id: message.id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user.id,
            name: user?.name,
            handle: message.user.handle,
            avatar: user?.profilePicture!,
          },
        };
      }),
    [messagesData?.pages, userConnections],
  );

  useEffect(() => {
    router.setParams({ members: (userConnections.length + 1).toString() });
  }, [userConnections]);

  const onAvatarPress = useCallback(
    (messageUser: User) => {
      if (messageUser._id === user.id) return;

      //@ts-ignore
      setSelectedUserHandle(messageUser.handle);
    },
    [user.id],
  );

  const { bottom } = useSafeAreaInsets();
  const ref = useRef<FlatList<IMessage>>();

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}>
        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
          <GiftedChat
            ref={ref}
            messages={messages ?? []}
            onSend={async (messages) => onSend(messages as MessageType[])}
            user={{
              _id: user.id,
              name: user.name ?? '',
              //@ts-ignore
              handle: user.handle ?? '',
              avatar: user.profilePicture ?? '',
            }}
            renderMessage={Message}
            listViewProps={{
              contentContainerStyle: [
                {
                  paddingBottom: headerHeight + 10,
                },
              ],
            }}
            renderInputToolbar={RenderInputToolbar}
            renderComposer={renderComposer}
            renderSend={renderSend}
            minInputToolbarHeight={100}
            bottomOffset={bottom}
            infiniteScroll
            scrollToBottom
            scrollToBottomComponent={() => (
              <BlurView
                style={[
                  tw`p-3 items-center justify-center rounded-full overflow-hidden bg-[#6e5ad1]`,
                ]}
                intensity={50}
                tint="light">
                <Iconify icon="ion:chevron-down-outline" color="white" size={24} />
              </BlurView>
            )}
            scrollToBottomStyle={tw`bg-transparent`}
            loadEarlier={hasNextMessagesPage}
            onLoadEarlier={() => fetchNextMessagesPage()}
            isLoadingEarlier={isFetchingNextMessagesPage}
            keyboardShouldPersistTaps="never"
            renderAvatarOnTop={false}
            renderUsernameOnMessage
            onPressAvatar={onAvatarPress}
            inverted
          />
          {Platform.OS === 'android' && (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight} />
          )}
        </LinearGradient>
        <ConnectionSheet
          ref={bottomSheetModalRef}
          onRemoveConnection={handleRemoveConnection}
          onDismiss={() => setSelectedUserHandle(undefined)}
          snapPoints={['85%']}
        />
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
  );
};

export default Messages;
