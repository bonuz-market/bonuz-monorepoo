import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import SwitchButton from '@/components/SwtichButton';
// import SwitchButton from '@/components/SwtichButton';
import { Text, View } from '@/components/Themed';

const coinDatas = [
  {
    id: 1,
    avatar: require('@/assets/images/connection/connection1.png'),
    name: 'JeanCalude',
    network: '@mende (mende.lens)',
    tokenAmount: '3.3461',
    tokenPrice: '~$4,141.25',
  },
  {
    id: 2,
    avatar: require('@/assets/images/connection/connection2.png'),
    name: 'Andre Goldner',
    network: '@Louie5',
    tokenAmount: '3,941.81',
    tokenPrice: '~$3,941.81',
  },
  {
    id: 3,
    avatar: require('@/assets/images/connection/connection3.png'),
    name: 'Daniel Hettinger',
    network: '@Hipolito',
    tokenAmount: '0.1906',
    tokenPrice: '~$3,277.53',
  },
  {
    id: 4,
    avatar: require('@/assets/images/connection/connection4.png'),
    name: 'Dominic Stamm',
    network: '@Carmelo',
    tokenAmount: '5.0998',
    tokenPrice: '~$1,423.87',
  },
  {
    id: 5,
    avatar: require('@/assets/images/connection/connection5.png'),
    name: 'Harriet Volkman',
    network: '@Angus',
    tokenAmount: '1,602.98',
    tokenPrice: '~$1,21.2.81',
  },
];
export default function Connection() {
  const { navigate } = useRouter();
  const [value, setValue] = useState<boolean>(true);

  return (
    <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
      <StatusBar backgroundColor={'#5137B1'} />
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
          { paddingTop: StatusBarHeight() },
        ]}>
        <TouchableOpacity onPress={() => navigate('/home')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
          </View>
        </TouchableOpacity>
        <View style={tw`flex bg-transparent justify-center items-center`}>
          <Text style={tw`text-[20px] text-white font-semibold`}>Social</Text>
        </View>
        <TouchableOpacity onPress={() => navigate('/cart')}>
          <View style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
            <View
              style={tw`bg-[#FF3B30] absolute top-[-1] left-9 w-[20px] rounded-full justify-center items-center`}>
              <Text style={tw`text-[13px] text-white font-semibold`}>3</Text>
            </View>
            <Image
              style={tw`w-[30px]`}
              source={require('@/assets/images/connection/messageIcon.png')}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={tw`bg-transparent mx-5 mt-10`}>
        <SwitchButton
          value={value}
          onValueChange={setValue}
          title1="Lens.xys Feed"
          title2="My Connections"
        />
      </View>

      <ScrollView style={tw`bg-transparent m-5 gap-10`}>
        {coinDatas.map((coindata, index) => (
          <View style={tw`bg-[#4837AE] p-4 rounded-3xl mt-3`} key={coindata.id || index}>
            <StatusBar backgroundColor={'#5137B1'} />
            <View style={tw`bg-transparent flex flex-row justify-between text-center items-center`}>
              <View style={tw`bg-transparent flex flex-row gap-2 justify-center items-center`}>
                <Image style={tw`w-16 h-16`} source={coindata.avatar} />
                <View style={tw`bg-transparent`}>
                  <Text style={tw`text-[20px] font-semibold text-white`}>{coindata.name}</Text>
                  <Text style={tw`text-[16px] font-normal text-white`}>{coindata.network}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigate('/connection')}>
                <View style={tw`bg-transparent`}>
                  <Image source={require('@/assets/images/connection/leftUpArrow.png')} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
