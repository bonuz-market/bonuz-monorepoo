/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { nativeApplicationVersion } from 'expo-application';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, SectionList, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { StatusBarHeight } from '@/components/StatusbarHeight';
import { useLogin } from '@/hooks/useLogin';

const VERSION_PREFIX = 'v0.';

const Settings = () => {
    const { bottom } = useSafeAreaInsets();
    const { logout } = useLogin();
    const navigation = useRouter();
    const handleLogout = () => {
        logout();
        navigation.navigate('/home');
    };

    const [walletSwitch, setWalletSwitch] = useState(false);
    const [biometricSwitch, setBiometricSwitch] = useState(false);
    const [notificationSwitch, setNotificationSwitch] = useState(false);

    return (
        <LinearGradient colors={['#4B2EA2', '#0E2875']} style={tw`flex-1`}>
            <View
                style={[
                    tw`flex flex-row justify-between items-center bg-[#5137B1] px-4 h-4/25 rounded-b-[10]`,
                    { paddingTop: StatusBarHeight(), marginBottom: 10 },
                ]}>
                <Link href="/profile" asChild>
                    <Pressable>
                        <View
                            style={tw`w-[54px] h-[54px] rounded-full bg-[#684FCD] justify-center items-center`}>
                            <Image style={tw`w-[30px]`} source={require('@/assets/images/cart/leftIcon.png')} />
                        </View>
                    </Pressable>
                </Link>
                <View style={tw`flex bg-transparent justify-center items-center`}>
                    <Text style={tw`text-[20px] text-white font-semibold`}>Settings</Text>
                </View>
                <TouchableOpacity onPress={() => { }}>
                    <View style={tw`w-[54px] h-[54px]`}></View>
                </TouchableOpacity>
            </View>
            <SectionList
                sections={[
                    {
                        title: 'Security',
                        data: [0],
                        renderItem: () => (
                            <View style={tw`bg-[#3135a3] rounded-2xl`}>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="keypad-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Enable Crypto Wallet</Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#2EB250' }}
                                        thumbColor="#f4f3f4"
                                        onValueChange={() => setWalletSwitch(!walletSwitch)}
                                        value={walletSwitch}
                                        style={tw`ml-auto`}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="wallet-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Manage MPC 2FA Wallet</Text>
                                    <Ionicons name="chevron-forward" size={24} color="white" style={tw`ml-auto`} />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Iconify icon="mynaui:face-id" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Biometric Lock</Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#2EB250' }}
                                        thumbColor="#f4f3f4"
                                        onValueChange={() => setBiometricSwitch(!biometricSwitch)}
                                        value={biometricSwitch}
                                        style={tw`ml-auto`}
                                    />
                                </View>
                            </View>
                        ),
                    },
                    {
                        title: 'Privacy',
                        data: [1],
                        renderItem: () => (
                            <View style={tw`bg-[#3135a3] rounded-2xl`}>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Iconify icon="mingcute:notification-newdot-line" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Notifications</Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#2EB250' }}
                                        thumbColor="#f4f3f4"
                                        onValueChange={() => setNotificationSwitch(!notificationSwitch)}
                                        value={notificationSwitch}
                                        style={tw`ml-auto`}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="wallet-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Personal Data</Text>
                                    <Ionicons name="chevron-forward" size={24} color="white" style={tw`ml-auto`} />
                                </View>
                            </View>
                        ),
                    },
                    {
                        title: 'Bonuz',
                        data: [2],
                        renderItem: () => (
                            <View style={tw`bg-[#3135a3] rounded-2xl`}>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Iconify icon="hugeicons:customer-support" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Support</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="information-circle-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>
                                        Bonuz on X (Formerly Twitter)
                                    </Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="information-circle-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Join Our Telegram</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="information-circle-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Report Bug / Feedback</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="information-circle-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>
                                        Brand / Partner Inquiry
                                    </Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="information-circle-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>About Bonuz</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="information-circle-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Terms & Conditions</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                                <View style={tw`border-b border-[#4741bb]`}></View>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="lock-closed-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Privacy Policy</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={24}
                                        color="white"
                                        style={tw.style(`ml-auto`, { transform: [{ rotate: '-45deg' }] })}
                                    />
                                </View>
                            </View>
                        ),
                    },
                ]}
                style={tw`bg-transparent px-4`}
                ListFooterComponent={() => (
                    <>
                        <View style={tw`bg-[#3135a3] rounded-2xl mt-4`}>
                            <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                <Ionicons name="information-circle-outline" size={24} color="white" />
                                <Text style={tw`text-white text-base font-semibold`}>App Version</Text>
                                <Text style={tw`text-white text-base font-semibold ml-auto`}>
                                    {' '}
                                    {VERSION_PREFIX + nativeApplicationVersion}
                                </Text>
                            </View>
                            <View style={tw`border-b border-[#4741bb]`}></View>

                            <Pressable onPress={handleLogout}>
                                <View style={tw`px-4 py-3 flex flex-row gap-2 items-center`}>
                                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                                    <Text style={tw`text-[#FF3B30] text-xl font-semibold`}>Logout</Text>
                                </View>
                            </Pressable>
                        </View>
                        <View style={{ height: bottom * 2 }}></View>
                    </>
                )}
                keyExtractor={(item) => item.toString()}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={tw`px-4 py-2`}>
                        <Text style={tw`text-white text-xl font-semibold`}>{title}</Text>
                    </View>
                )}
                stickySectionHeadersEnabled={false}
                SectionSeparatorComponent={() => <View style={tw`h-2`}></View>}
            />
        </LinearGradient>
    );
};

export default Settings;
