/* eslint-disable prettier/prettier */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import { TokenProps } from '@/entities';


export default function SwapComponent(props: { setOption: any; option: string, handleSwapNext: any, swapNetwork: string, destinationNetwork: string, handleDismissModalPress: any, handleTokenSection: any, swapToken: TokenProps, swapDesToken: TokenProps, setSwapTokenType: any }) {
    const { setOption, option, handleSwapNext, swapNetwork, destinationNetwork, handleDismissModalPress, handleTokenSection, swapToken, swapDesToken, setSwapTokenType } = props;

    return (
        <View style={tw`flex-1`}>
            <View style={tw`flex flex-row mx-10 justify-between my-5`}>
                <TouchableOpacity onPress={() => setOption('swap')}>
                    <Text style={[tw`text-[20px] text-white p-2`, option === 'swap' && tw`border-[#EC6640] border-b-2`]}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOption('bridgeType')}>
                    <Text style={[tw`text-[20px] text-white p-2`, option === 'bridgeType' && tw`border-[#EC6640] border-b-2`]}>Bridge</Text>
                </TouchableOpacity>
            </View>
            {option === 'swap' ? (
                <View style={tw`flex flex-1 mt-8 mx-5`}>
                    <View style={tw`flex flex-row`}>
                        <View style={tw`justify-center w-1/2`}>
                            <Text style={tw`text-white text-[16px] font-semibold`}>Chain:</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleSwapNext('swap')} style={tw`justify-between w-1/2`}>
                            <View style={tw`flex justify-between flex-row items-center`}>
                                <Text style={tw`text-white text-[14px] font-medium`}>{swapNetwork}</Text>
                                <Image
                                    style={tw`w-[10px] h-[5.83px] items-center`}
                                    source={require('@/assets/images/cart/downIcon.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mt-4 bg-[#313CA6] p-2 rounded-md gap-2`}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`text-white text-[14px] font-semibold`}>From</Text>
                            <Text style={tw`text-white text-[14px] font-semibold`}>Balance: 0.00000 {swapToken.symbol}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center`}>
                            <View style={tw`px-2 bg-[#040D5C] rounded-md w-6/10 h-[40px] flex flex-row justify-between items-center`}>
                                <TextInput
                                    placeholderTextColor={'#BAB3E2'}
                                    placeholder="0"
                                    style={tw`text-[16px] font-normal text-white px-2 bg-[#040D5C] rounded-md w-8/10 h-[40px]`}
                                />
                                <TouchableOpacity onPress={() => console.log('sdf')}>
                                    <Text style={tw`text-[16px] text-white font-normal text-right`}>MAX</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => { handleTokenSection(); setSwapTokenType('sourceSwapToken') }}>
                                <View style={tw`flex flex-row justify-between items-center gap-2 `}>
                                    <Image style={tw`w-[40px] h-[40px] rounded-full`} source={{ uri: swapToken.logoURI }} />
                                    <Text style={tw`text-white font-semibold text-[14px]`}>{swapToken.name}</Text>
                                    <Image
                                        style={tw`w-[10px] h-[5.83px] items-center justify-center`}
                                        source={require('@/assets/images/cart/downIcon.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={tw`text-white text-[14px] font-semibold`}>= $0</Text>
                        </View>
                    </View>
                    <View style={tw`w-full items-center mt-4`}>
                        <Image style={tw`w-4 h-4`} source={require('@/assets/images/swap/swap.png')} />
                    </View>
                    <View style={tw`mt-4 bg-[#313CA6] p-2 rounded-md gap-2 flex flex-row justify-between items-center`}>
                        <View>
                            <View style={tw`flex flex-row justify-between`}>
                                <Text style={tw`text-white text-[14px] font-semibold`}>To(Quote)</Text>
                            </View>
                            <View>
                                <Text style={tw`text-white text-[14px] font-semibold`}>0.00000</Text>
                            </View>
                            <View>
                                <Text style={tw`text-white text-[14px] font-semibold`}>= $0</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => { handleTokenSection(); setSwapTokenType('desSwapToken') }}>
                            <View style={tw`flex flex-row justify-between items-center gap-2 `}>
                                <Image style={tw`w-[40px] h-[40px] rounded-full`} source={{ uri: swapDesToken.logoURI }} />
                                <Text style={tw`text-white font-semibold text-[14px]`}>{swapDesToken.name}</Text>
                                <Image
                                    style={tw`w-[10px] h-[5.83px] items-center justify-center`}
                                    source={require('@/assets/images/cart/downIcon.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { handleDismissModalPress() }}>
                        <LinearGradient
                            colors={['#EB722E', '#F224A6']}
                            style={tw`bg-transparent mt-10 p-3 justify-center items-center rounded-md`}>
                            <Text style={tw`text-white text-[16px]`}>Swap</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={tw`flex flex-1 mt-8 mx-5`}>
                    <View style={tw`flex flex-row`}>
                        <View style={tw`justify-center w-1/2`}>
                            <Text style={tw`text-white text-[16px] font-semibold`}>Chain:</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleSwapNext('swap')} style={tw`justify-between w-1/2`}>
                            <View style={tw`flex justify-between flex-row items-center`}>
                                <Text style={tw`text-white text-[14px] font-medium`}>{swapNetwork}</Text>
                                <Image
                                    style={tw`w-[10px] h-[5.83px] items-center`}
                                    source={require('@/assets/images/cart/downIcon.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mt-4 bg-[#313CA6] p-2 rounded-md gap-2`}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`text-white text-[14px] font-semibold`}>From</Text>
                            <Text style={tw`text-white text-[14px] font-semibold`}>Balance: 0.00000 {swapToken.symbol}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center`}>
                            <View style={tw`px-2 bg-[#040D5C] rounded-md w-6/10 h-[40px] flex flex-row justify-between items-center`}>
                                <TextInput
                                    placeholderTextColor={'#BAB3E2'}
                                    placeholder="0"
                                    style={tw`text-[16px] font-normal text-white px-2 bg-[#040D5C] rounded-md w-8/10 h-[40px]`}
                                />
                                <TouchableOpacity onPress={() => console.log('sdf')}>
                                    <Text style={tw`text-[16px] text-white font-normal text-right`}>MAX</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => { handleTokenSection(); setSwapTokenType('sourceSwapToken') }}>
                                <View style={tw`flex flex-row justify-between items-center gap-2 `}>
                                    <Image style={tw`w-[40px] h-[40px] rounded-full`} source={{ uri: swapToken.logoURI }} />
                                    <Text style={tw`text-white font-semibold text-[14px]`}>{swapToken.name}</Text>
                                    <Image
                                        style={tw`w-[10px] h-[5.83px] items-center justify-center`}
                                        source={require('@/assets/images/cart/downIcon.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={tw`text-white text-[14px] font-semibold`}>= $0</Text>
                        </View>
                    </View>

                    <View style={tw`w-full items-center mt-4`}>
                        <Image style={tw`w-4 h-4`} source={require('@/assets/images/swap/swap.png')} />
                    </View>
                    <View style={tw`flex flex-row mt-4`}>
                        <View style={tw`justify-center w-1/2`}>
                            <Text style={tw`text-white text-[16px] font-semibold`}>Destination Chain:</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleSwapNext('destination')} style={tw`justify-between w-1/2`}>
                            <View style={tw`flex justify-between flex-row items-center`}>
                                <Text style={tw`text-white text-[14px] font-medium`}>{destinationNetwork}</Text>
                                <Image
                                    style={tw`w-[10px] h-[5.83px] items-center`}
                                    source={require('@/assets/images/cart/downIcon.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mt-4 bg-[#313CA6] p-2 rounded-md gap-2 flex flex-row justify-between items-center`}>
                        <View>
                            <View style={tw`flex flex-row justify-between`}>
                                <Text style={tw`text-white text-[14px] font-semibold`}>To(Quote)</Text>
                            </View>
                            <View>
                                <Text style={tw`text-white text-[14px] font-semibold`}>0.00000</Text>
                            </View>
                            <View>
                                <Text style={tw`text-white text-[14px] font-semibold`}>= $0</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => { handleTokenSection(); setSwapTokenType('desSwapToken') }}>
                            <View style={tw`flex flex-row justify-between items-center gap-2 `}>
                                <Image style={tw`w-[40px] h-[40px] rounded-full`} source={{ uri: swapDesToken.logoURI }} />
                                <Text style={tw`text-white font-semibold text-[14px]`}>{swapDesToken.name}</Text>
                                <Image
                                    style={tw`w-[10px] h-[5.83px] items-center justify-center`}
                                    source={require('@/assets/images/cart/downIcon.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { handleDismissModalPress() }}>
                        <LinearGradient
                            colors={['#EB722E', '#F224A6']}
                            style={tw`bg-transparent mt-10 p-3 justify-center items-center rounded-md`}>
                            <Text style={tw`text-white text-[16px]`}>Swap</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
