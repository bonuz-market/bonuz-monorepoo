export interface networkConfigItem {
  name?: string
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  31_337: {
    name: 'localhost'
  },
  5: {
    name: 'goerli'
  },
  4: {
    name: 'rinkeby'
  },
  1: {
    name: 'mainnet'
  }
}

export const INITIAL_SUPPLY = '1000000000'
export const developmentChains = ['hardhat', 'localhost']
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6



// -----------------------------------------
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
]

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
  'w_wallet1',
  'w_wallet2',
  'w_wallet3',
  'w_wallet4',
  'w_wallet5',
]

const messengers = ['m_telegram', 'm_whatsapp', 'm_signal', 'm_weChat']

const digitalIdentifiers = ['d_ens', 'd_worldId', 'd_lens']

export const SUPPORTED_PLATFORMS = [
  ...socialMedias,
  ...blockchainsWallets,
  ...messengers,
  ...digitalIdentifiers
]