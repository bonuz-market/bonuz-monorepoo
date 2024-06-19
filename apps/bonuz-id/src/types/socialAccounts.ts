
export const SOCIAL_ACCOUNTS = {
  s_x: 'x',
  s_instagram: 'instagram',
  s_facebook: 'facebook',
  s_tiktok: 'tiktok',
  s_snapchat: 'snapchat',
  s_linkedin: 'linkedin',
  s_discord: 'discord',
  s_pinterest: 'pinterest',
  s_twitch: 'twitch',
  s_reddit: 'reddit',
  s_mastadon: 'mastadon',
  s_youmeme: 'youmeme',
  s_rumble: 'rumble',
  s_youtube: 'youtube',
  s_vk: 'vk',
  s_qq: 'qq',
} as const;

export const MESSAGING_APPS = {
  m_whatsapp: 'whatsapp',
  m_telegram: 'telegram',
  m_signal: 'signal',
  m_weChat: 'weChat',
} as const;

export type SocialAccount = (typeof SOCIAL_ACCOUNTS)[keyof typeof SOCIAL_ACCOUNTS];

export type MessagingAppType = (typeof MESSAGING_APPS)[keyof typeof MESSAGING_APPS];

export interface MessagingApp {
  handle: string;
  isPublic: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const socialMedias = [
  's_x',
  's_instagram',
  's_facebook',
  's_linkedin',
  's_tiktok',
  's_snapchat',
  's_discord',
  's_pinterest',
  's_twitch',
  's_reddit',
  's_mastadon',
  's_youmeme',
  's_rumble',
  's_youtube',
  's_vk',
  's_qq',
];

const blockchainsWallets = [
  'w_walletConnect',
  'w_near',
  'w_sui',
  'w_aptos',
  'w_cosmos',
  'w_cardano',
  'w_solana',
  'w_icp',
  'w_btc',
  'w_doge',
  'w_polkadot',
  'w_lukso',
];

const messengers = ['m_telegram', 'm_whatsapp', 'm_signal', 'm_weChat'];

const digitalIdentifiers = ['d_ens', 'd_worldId', 'd_lens'];

export const SUPPORTED_PLATFORMS = [
  ...socialMedias,
  ...blockchainsWallets,
  ...messengers,
  ...digitalIdentifiers,
];

type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];

export type SocialMapping = Record<SupportedPlatform, string>;

export const SOCIAL_BASE_URLS: SocialMapping = {
  [SOCIAL_ACCOUNTS.s_facebook]: 'facebook.com/',
  [SOCIAL_ACCOUNTS.s_x]: 'twitter.com/',
  [SOCIAL_ACCOUNTS.s_tiktok]: 'tiktok.com/@',
  [SOCIAL_ACCOUNTS.s_instagram]: 'instagram.com/',
  [SOCIAL_ACCOUNTS.s_snapchat]: 'snapchat.com/add/',
  [SOCIAL_ACCOUNTS.s_linkedin]: 'linkedin.com/in/',
  [SOCIAL_ACCOUNTS.s_discord]: 'discord.com/users/',
  [SOCIAL_ACCOUNTS.s_pinterest]: 'pinterest.com/',
  [SOCIAL_ACCOUNTS.s_twitch]: 'twitch.tv/',
  [SOCIAL_ACCOUNTS.s_reddit]: 'reddit.com/user/',
  [SOCIAL_ACCOUNTS.s_mastadon]: 'mastadon.social/@',
  [SOCIAL_ACCOUNTS.s_youmeme]: 'youmeme.com/',
  [SOCIAL_ACCOUNTS.s_rumble]: 'rumble.com/',
  [SOCIAL_ACCOUNTS.s_youtube]: 'youtube.com/@',
  [SOCIAL_ACCOUNTS.s_vk]: 'vk.com/',
  [SOCIAL_ACCOUNTS.s_qq]: 'qq.com/',
};

export const MESSAGING_APP_BASE_URLS: SocialMapping = {
  [MESSAGING_APPS.m_whatsapp]: 'wa.me/',
  [MESSAGING_APPS.m_telegram]: 't.me/',
  [MESSAGING_APPS.m_signal]: 'signal.me/',
  [MESSAGING_APPS.m_weChat]: 'weChat.com/',
};


export const BLOCKCHAIN_WALLET_BASE_URLS: SocialMapping = {
  w_walletconnect: '',
  w_near: '',
  w_sui: '',
  w_aptos: '',
  w_cosmos: '',
  w_cardano: '',
  w_solana: '',
  w_icp: '',
  w_btc: '',
  w_doge: '',
  w_polkadot: '',
  w_lukso: '',
};

export const DIGITAL_IDENTIFIER_BASE_URLS: SocialMapping = {
  d_ens: '',
  d_lens: '',
  d_worldId: '',
};

export const SOCIAL_ICON_NAMES: SocialMapping = {
  s_whatsapp: 'whatsapp',
  s_telegram: 'telegram',
  s_instagram: 'instagram',
  s_twitter: 'twitter',
  s_facebook: 'facebook',
  s_linkedin: 'linkedin',
  s_snapchat: 'snapchat',
  s_tiktok: 'tiktok',
};
// ---------------------------------

