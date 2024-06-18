import React from 'react';
import { Image } from 'react-native';
import { Iconify } from 'react-native-iconify';

import {
  DECENTRALIZED_IDENTIFIERS,
  DOMAINS,
  Link,
  MESSAGING_APPS,
  SOCIAL_ACCOUNTS,
  UTILITY_TOOLS,
  VALIDATORS,
  WALLETS,
} from '@/entities';

export const supportedLinks: Record<string, Link> = {
  facebook: {
    handle: '',
    isPublic: true,
    type: 'facebook',
  },
  instagram: {
    handle: '',
    isPublic: true,
    type: 'instagram',
  },
  x: {
    handle: '',
    isPublic: true,
    type: 'x',
  },
  tiktok: {
    handle: '',
    isPublic: true,
    type: 'tiktok',
  },
  snapchat: {
    handle: '',
    isPublic: true,
    type: 'snapchat',
  },
  linkedin: {
    handle: '',
    isPublic: true,
    type: 'linkedin',
  },
  discord: {
    handle: '',
    isPublic: true,
    type: 'discord',
  },
  pinterest: {
    handle: '',
    isPublic: true,
    type: 'pinterest',
  },
  twitch: {
    handle: '',
    isPublic: true,
    type: 'twitch',
  },
  reddit: {
    handle: '',
    isPublic: true,
    type: 'reddit',
  },
  mastadon: {
    handle: '',
    isPublic: true,
    type: 'mastadon',
  },
  youmeme: {
    handle: '',
    isPublic: true,
    type: 'youmeme',
  },
  rumble: {
    handle: '',
    isPublic: true,
    type: 'rumble',
  },
  youtube: {
    handle: '',
    isPublic: true,
    type: 'youtube',
  },
  vk: {
    handle: '',
    isPublic: true,
    type: 'vk',
  },
  qq: {
    handle: '',
    isPublic: true,
    type: 'qq',
  },
};
export const ICONS_MAPPING = {
  [SOCIAL_ACCOUNTS.s_facebook]: <Iconify icon="mdi:facebook" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_x]: <Iconify icon="ri:twitter-x-line" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_tiktok]: <Iconify icon="simple-icons:tiktok" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_snapchat]: <Iconify icon="mdi:snapchat" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_instagram]: <Iconify icon="mdi:instagram" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_linkedin]: <Iconify icon="mdi:linkedin" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_discord]: <Iconify icon="mdi:discord" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_pinterest]: <Iconify icon="mdi:pinterest" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_twitch]: <Iconify icon="mdi:twitch" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_reddit]: <Iconify icon="mdi:reddit" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_mastadon]: <Iconify icon="mdi:mastodon" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_youmeme]: (
    <Image
      source={require('@/assets/images/platforms/youmeme.jpg')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="youmeme"
    />
  ),
  [SOCIAL_ACCOUNTS.s_rumble]: <Iconify icon="simple-icons:rumble" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_youtube]: <Iconify icon="mdi:youtube" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_vk]: <Iconify icon="mdi:vk" size={32} color="white" />,
  [SOCIAL_ACCOUNTS.s_qq]: <Iconify icon="mdi:qqchat" size={32} color="white" />,
  [MESSAGING_APPS.m_whatsapp]: <Iconify icon="mdi:whatsapp" size={32} color="white" />,
  [MESSAGING_APPS.m_telegram]: <Iconify icon="mdi:telegram" size={32} color="white" />,
  [MESSAGING_APPS.m_signal]: <Iconify icon="mdi:signal" size={32} color="white" />,
  [MESSAGING_APPS.m_weChat]: <Iconify icon="mdi:wechat" size={32} color="white" />,
  [WALLETS.w_solana]: <Iconify icon="formkit:solana" size={32} color="white" />,
  [WALLETS.w_btc]: <Iconify icon="mdi:bitcoin" size={32} color="white" />,
  [WALLETS.w_near]: <Iconify icon="simple-icons:near" size={32} color="white" />,
  [WALLETS.w_cardano]: <Iconify icon="simple-icons:cardano" size={32} color="white" />,
  // [WALLETS.w_venom]: 'mdi:venom',
  [WALLETS.w_walletConnect]: <Iconify icon="simple-icons:walletconnect" size={32} color="white" />,
  [WALLETS.w_sui]: (
    <Image
      source={require('@/assets/images/platforms/sui.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="sui"
    />
  ),
  [WALLETS.w_aptos]: (
    <Image
      source={require('@/assets/images/platforms/aptos.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="aptos"
    />
  ),
  [WALLETS.w_cosmos]: (
    <Image
      source={require('@/assets/images/platforms/cosmos.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="cosmos"
    />
  ),
  [WALLETS.w_icp]: <Iconify icon="cryptocurrency:icp" size={32} color="white" />,
  [WALLETS.w_doge]: <Iconify icon="simple-icons:dogecoin" size={32} color="white" />,
  [WALLETS.w_polkadot]: <Iconify icon="simple-icons:polkadot" size={32} color="white" />,
  [WALLETS.w_lukso]: (
    <Image
      source={require('@/assets/images/platforms/lukso.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="lukso"
    />
  ),
  [WALLETS.w_algorand]: (
    <Image
      source={require('@/assets/images/platforms/algorand.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="algorand"
    />
  ),
  [WALLETS.w_tron]: (
    <Image
      source={require('@/assets/images/platforms/tron.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="tron"
    />
  ),
  [WALLETS.w_ton]: (
    <Image
      source={require('@/assets/images/platforms/ton.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="ton"
    />
  ),
  [UTILITY_TOOLS.u_notion]: <Iconify icon="simple-icons:notion" size={32} color="white" />,
  [UTILITY_TOOLS.u_figma]: <Iconify icon="ph:figma-logo" size={32} color="white" />,
  [UTILITY_TOOLS.u_cheatcodeLabel]: <></>,
  [UTILITY_TOOLS.u_aluna]: <></>,
  [VALIDATORS.v_idSign]: <></>,
  [VALIDATORS.v_lens]: (
    <Image
      source={require('@/assets/images/platforms/lens.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="lens"
    />
  ),
  [VALIDATORS.v_polygonID]: <Iconify icon="devicon-plain:polygon" size={32} color="white" />,
  [VALIDATORS.v_uXXPass]: <></>,
  [VALIDATORS.v_blockpassKYC]: (
    <Image
      source={require('@/assets/images/platforms/blockpass.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="blockpass"
    />
  ),
  [DOMAINS.d_ens]: <Iconify icon="cryptocurrency:eth" size={32} color="white" />,
  [DECENTRALIZED_IDENTIFIERS.d_worldId]: (
    <Image
      source={require('@/assets/images/platforms/worldId.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="worldId"
    />
  ),

  [DECENTRALIZED_IDENTIFIERS.d_bnb]: (
    <Image
      source={require('@/assets/images/platforms/bnbNameService.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="bnbNameService"
    />
  ),
  [DECENTRALIZED_IDENTIFIERS.d_demos]: (
    <Image
      source={require('@/assets/images/platforms/demos.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="demos"
    />
  ),
  [DECENTRALIZED_IDENTIFIERS.d_anima]: (
    <Image
      source={require('@/assets/images/platforms/anima.png')}
      style={{ width: 32, height: 32, resizeMode: 'contain' }}
      alt="anima"
    />
  ),
} satisfies Record<string, React.ReactNode>;
export const ICONS_MAPPING_SMALL = {
  [SOCIAL_ACCOUNTS.s_facebook]: <Iconify icon="mdi:facebook" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_x]: <Iconify icon="ri:twitter-x-line" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_tiktok]: <Iconify icon="simple-icons:tiktok" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_snapchat]: <Iconify icon="mdi:snapchat" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_instagram]: <Iconify icon="mdi:instagram" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_linkedin]: <Iconify icon="mdi:linkedin" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_discord]: <Iconify icon="mdi:discord" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_pinterest]: <Iconify icon="mdi:pinterest" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_twitch]: <Iconify icon="mdi:twitch" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_reddit]: <Iconify icon="mdi:reddit" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_mastadon]: <Iconify icon="mdi:mastodon" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_youmeme]: (
    <Image
      source={require('@/assets/images/platforms/youmeme.jpg')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="youmeme"
    />
  ),
  [SOCIAL_ACCOUNTS.s_rumble]: <Iconify icon="simple-icons:rumble" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_youtube]: <Iconify icon="mdi:youtube" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_vk]: <Iconify icon="mdi:vk" size={16} color="white" />,
  [SOCIAL_ACCOUNTS.s_qq]: <Iconify icon="mdi:qqchat" size={16} color="white" />,
  [MESSAGING_APPS.m_whatsapp]: <Iconify icon="mdi:whatsapp" size={16} color="white" />,
  [MESSAGING_APPS.m_telegram]: <Iconify icon="mdi:telegram" size={16} color="white" />,
  [MESSAGING_APPS.m_signal]: <Iconify icon="mdi:signal" size={16} color="white" />,
  [MESSAGING_APPS.m_weChat]: <Iconify icon="mdi:wechat" size={16} color="white" />,
  [WALLETS.w_solana]: <Iconify icon="formkit:solana" size={16} color="white" />,
  [WALLETS.w_btc]: <Iconify icon="mdi:bitcoin" size={16} color="white" />,
  [WALLETS.w_near]: <Iconify icon="simple-icons:near" size={16} color="white" />,
  [WALLETS.w_cardano]: <Iconify icon="simple-icons:cardano" size={16} color="white" />,
  // [WALLETS.w_venom]: 'mdi:venom',
  [WALLETS.w_walletConnect]: <Iconify icon="simple-icons:walletconnect" size={16} color="white" />,
  [WALLETS.w_sui]: (
    <Image
      source={require('@/assets/images/platforms/sui.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="sui"
    />
  ),
  [WALLETS.w_aptos]: (
    <Image
      source={require('@/assets/images/platforms/aptos.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="aptos"
    />
  ),
  [WALLETS.w_cosmos]: (
    <Image
      source={require('@/assets/images/platforms/cosmos.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="cosmos"
    />
  ),
  [WALLETS.w_icp]: <Iconify icon="cryptocurrency:icp" size={16} color="white" />,
  [WALLETS.w_doge]: <Iconify icon="simple-icons:dogecoin" size={16} color="white" />,
  [WALLETS.w_polkadot]: <Iconify icon="simple-icons:polkadot" size={16} color="white" />,
  [WALLETS.w_lukso]: (
    <Image
      source={require('@/assets/images/platforms/lukso.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="lukso"
    />
  ),
  [WALLETS.w_algorand]: (
    <Image
      source={require('@/assets/images/platforms/algorand.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="algorand"
    />
  ),
  [WALLETS.w_tron]: (
    <Image
      source={require('@/assets/images/platforms/tron.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="tron"
    />
  ),
  [WALLETS.w_ton]: (
    <Image
      source={require('@/assets/images/platforms/ton.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="ton"
    />
  ),
  [UTILITY_TOOLS.u_notion]: <Iconify icon="simple-icons:notion" size={16} color="white" />,
  [UTILITY_TOOLS.u_figma]: <Iconify icon="ph:figma-logo" size={16} color="white" />,
  [UTILITY_TOOLS.u_cheatcodeLabel]: <></>,
  [UTILITY_TOOLS.u_aluna]: <></>,
  [VALIDATORS.v_idSign]: <></>,
  [VALIDATORS.v_lens]: (
    <Image
      source={require('@/assets/images/platforms/lens.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="lens"
    />
  ),
  [VALIDATORS.v_polygonID]: <Iconify icon="devicon-plain:polygon" size={16} color="white" />,
  [VALIDATORS.v_uXXPass]: <></>,
  [VALIDATORS.v_blockpassKYC]: (
    <Image
      source={require('@/assets/images/platforms/blockpass.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="blockpass"
    />
  ),
  [DOMAINS.d_ens]: <Iconify icon="cryptocurrency:eth" size={16} color="white" />,
  [DECENTRALIZED_IDENTIFIERS.d_worldId]: (
    <Image
      source={require('@/assets/images/platforms/worldId.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="worldId"
    />
  ),
  [DECENTRALIZED_IDENTIFIERS.d_bnb]: (
    <Image
      source={require('@/assets/images/platforms/bnbNameService.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="bnbNameService"
    />
  ),
  [DECENTRALIZED_IDENTIFIERS.d_demos]: (
    <Image
      source={require('@/assets/images/platforms/demos.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="demos"
    />
  ),
  [DECENTRALIZED_IDENTIFIERS.d_anima]: (
    <Image
      source={require('@/assets/images/platforms/anima.png')}
      style={{ width: 16, height: 16, resizeMode: 'contain' }}
      alt="anima"
    />
  ),
} satisfies Record<string, React.ReactNode>;

export const getIcon = (type: string, size: 'normal' | 'small') => {
  if (type.startsWith('wallet')) {
    return size === 'normal'
      ? ICONS_MAPPING['walletConnect']
      : ICONS_MAPPING_SMALL['walletConnect'];
  }
  return size === 'normal'
    ? ICONS_MAPPING[type as keyof typeof ICONS_MAPPING]
    : ICONS_MAPPING_SMALL[type as keyof typeof ICONS_MAPPING_SMALL];
};
