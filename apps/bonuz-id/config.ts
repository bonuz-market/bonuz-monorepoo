// ----------------------------------------------------------------------

// .env
export const backendBaseUrl = 'https://bonuz-admin-wts46rwpca-ey.a.run.app';

// ----------------------------------------------------------------------

export const links = {
  community: 'https://bonuz.to/discord',
  whitepaper: ' http://bonuz.to/whitepaper',
  ios: 'https://bonuz.to/beta-registration',
  android: 'https://bonuz.to/beta-registration',
  privacyPolicy: 'https://bonuz.to/privacy-gdpr-policy',
  creatorSignup: 'https://bonuz.to/creator-signup',
  signin: 'https://enter.bonuz.market',
  privateSale: 'https://bonuz.to/private-sale',
};

export const socials = {
  telegram: 'https://t.me/BonuzMarket',
  twitter: 'https://twitter.com/BonuzMarket',
  medium: 'https://bonuzmarket.medium.com/',
  telegramMessage: 'https://t.me/BonuzHQ',
  instagram: 'https://www.instagram.com/bonuzmarket',
  facebook: 'https://www.facebook.com/BonuzMarket',
};

// --------------------------------------------------------------------------

// ---------------------------------------------------------------

export const APP_SCHEME = 'bonuzapp://'; // app-scheme from app.json scheme

// -------------------------------------------------------------

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const POLYGON_MAINNET = 137;
const POLYGON_MUMBAI = 80001;
const ARBITRUM_NOVA_MAINNET = 42170;
const CORE_DAO_MAINNET = 1116;
const CORE_DAO_TESTNET = 1117;
// ---------------------------------------------------------------
export const bonuzTokensChainId = POLYGON_MAINNET; // bonuz tokens
// export const bonuzSocialIdChainId = ChainId.POLYGON_MUMBAI
// export const bonuzSocialIdChainId =  ChainId.ARBITRUM_NOVA_MAINNET
export const bonuzSocialIdChainId = CORE_DAO_MAINNET // core dao mainnet


export const RPC_URL = {
  [POLYGON_MAINNET]: 'https://polygon-mainnet.g.alchemy.com/v2/NlnCuGZCDhj1TGuo1b2oWuoo15S0kMux',
  [POLYGON_MUMBAI]: 'https://polygon-mumbai.g.alchemy.com/v2/EROYWWSD-qhru7JhxBAp1w4QtzubB16A',
  [ARBITRUM_NOVA_MAINNET]: 'https://nova.arbitrum.io/rpc',
  [CORE_DAO_MAINNET]: 'https://rpc.coredao.org',
}