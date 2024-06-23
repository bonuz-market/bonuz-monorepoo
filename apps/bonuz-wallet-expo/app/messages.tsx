import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Avatar, GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { User as UserEntity } from '@/entities/user';
import {
  InputToolbar,
  Message,
  renderComposer,
  RenderInputToolbar,
  renderSend,
} from '@/pages/messages/components';
import { UserSheet } from '@/pages/scan/sheets/user';
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
    isLoading: isMessagesLoading,
    fetchNextPage: fetchNextMessagesPage,
    hasNextPage: hasNextMessagesPage,
    isFetchingNextPage: isFetchingNextMessagesPage,
  } = useUserMessages();
  const { data: selectedUserData, refetch: refetchSelectedUser } =
    useQueryGetUserProfileAndSocialLinksByHandle({ handle: selectedUserHandle });

  const { data: userConnections } = useUserConnections();
  useEffect(() => {
    if (selectedUserData && selectedUserHandle) {
      bottomSheetModalRef.current?.present(selectedUserData);
    }
  }, [selectedUserData, selectedUserHandle]);

  const handleRemoveConnection = async () => {
    await refetchSelectedUser();
  };

  const handleAddConnection = async () => {
    await refetchSelectedUser();
  };

  const { mutateAsync: sendMessageAsync } = useMutation({
    mutationFn: ({ message }: { message: string }) => sendMessage(message),
    onSuccess: () => refetchMessages(),
  });

  const onSend = useCallback(
    (messages: MessageType[] = []) => {
      sendMessageAsync({
        message: messages[0].text,
      });
    },
    [sendMessageAsync],
  );

  const headerHeight = useHeaderHeight();

  const messages = useMemo(
    () =>
      messagesData?.pages
        ?.map((page) => page.messages.data)
        .flat()
        .map((message) => {
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

  const onAvatarPress = useCallback(
    (messageUser: User) => {
      if (messageUser._id === user.id) return;

      //@ts-ignore
      setSelectedUserHandle(messageUser.handle);
    },
    [user.id],
  );

  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}>
        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
          <GiftedChat
            messages={messages ?? []}
            onSend={(messages) => onSend(messages as MessageType[])}
            user={{
              _id: user.id,
              name: user.name ?? '',
              //@ts-ignore
              handle: user.handle ?? '',
              avatar: user.profilePicture ?? '',
            }}
            renderMessage={Message}
            messagesContainerStyle={{}}
            listViewProps={{
              contentContainerStyle: {
                flexGrow: 1,
                justifyContent: 'flex-end',
              },
            }}
            renderInputToolbar={RenderInputToolbar}
            renderComposer={renderComposer}
            renderSend={renderSend}
            minInputToolbarHeight={100}
            bottomOffset={bottom}
            infiniteScroll
            scrollToBottom
            loadEarlier={hasNextMessagesPage}
            onLoadEarlier={() => fetchNextMessagesPage()}
            isLoadingEarlier={isFetchingNextMessagesPage}
            keyboardShouldPersistTaps="never"
            renderAvatarOnTop={false}
            renderUsernameOnMessage
            onPressAvatar={onAvatarPress}
          />
          {Platform.OS === 'android' && (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight} />
          )}
        </LinearGradient>
        <UserSheet
          ref={bottomSheetModalRef}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
          onDismiss={() => setSelectedUserHandle(undefined)}
        />
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
  );
};

export default Messages;
