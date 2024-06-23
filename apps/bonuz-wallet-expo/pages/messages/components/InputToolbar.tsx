import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import {
  Composer,
  ComposerProps,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import tw from 'twrnc';

export const renderComposer = (props: ComposerProps) => (
  <Composer
    {...props}
    textInputProps={{
      style: tw`ml-0 px-4 py-4 text-white  flex-1 items-center justify-center`,
    }}
    placeholder="Write a message..."
    placeholderTextColor="rgba(255,255,255,0.7)"
  />
);

export const renderSend = (props: SendProps<any>) => (
  <Send {...props} containerStyle={tw`justify-center px-4 self-center`}>
    <Ionicons name="send-outline" color="white" size={24} disabled={props.disabled} />
  </Send>
);
export const RenderInputToolbar = (props: InputToolbarProps<any>) => {
  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 25 : 10}
      tint={Platform.OS === 'ios' ? 'light' : 'dark'}
      experimentalBlurMethod="dimezisBlurView"
      style={[tw`flex-1 bg-[#152f7d] overflow-hidden rounded-[30px] h-[100px] w-full`]}>
      <InputToolbar
        {...props}
        containerStyle={[tw`flex-1 bg-[#01084233] py-3 px-4 border-t-0 h-[100px]`]}
        primaryStyle={tw` bg-[#233c9d] rounded-[30px]`}
      />
    </BlurView>
  );
};
