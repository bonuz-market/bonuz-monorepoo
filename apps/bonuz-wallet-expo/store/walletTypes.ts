export const walletTypes = [
  {
    id: 1,
    name: 'Smart Wallet',
    walletIcon: '',
  },
  {
    id: 2,
    name: 'EOA Wallet',
    walletIcon: '',
  },
  {
    id: 3,
    name: 'Tron Wallet',
    walletIcon: '',
  },
  {
    id: 4,
    name: 'Bitcoin Wallet',
    walletIcon: '',
  },
  {
    id: 5,
    name: 'Solana Wallet',
    walletIcon: '',
  },
  {
    id: 6,
    name: 'Ton Wallet',
    walletIcon: '',
  },
  {
    id: 7,
    name: 'Doge Wallet',
    walletIcon: '',
  },
];

export const networkTypes = [
  {
    id: 1,
    network: 'All Networks',
    chainId: '0',
  },
  {
    id: 2,
    network: 'Polygon',
    chainId: '137',
  },
  {
    id: 3,
    network: 'Ethereum',
    chainId: '1',
  },
  {
    id: 4,
    network: 'BNB Smart Chain',
    chainId: '56',
  },
  {
    id: 5,
    network: 'Arbitrum',
    chainId: '42_161',
  },
  {
    id: 6,
    network: 'Base',
    chainId: '8453',
  },
  {
    id: 7,
    network: 'Core Dao',
    chainId: '1116',
  },
];

export interface TransactionDataProps {
  id: number;
  senderAddress: string;
  receiverAddress: string;
  transferAmount: string;
  tokenName: string;
  tokenSymbol: string;
  date: string;
  explorerUrl: string;
}
export interface TokenDataProps {
  id: number;
  avatar: any;
  name: string;
  network: string;
  tokenAmount: string;
  tokenPrice: string;
  chainId: number;
  contractAddress: string;
}

export interface TokenData {
  logoURI: string;
  symbol: string;
  balance: number;
  quote: number;
  address: string;
  chainId: number;
}

export interface WalletDataProps {
  id: number;
  avatar: any;
  name: string;
  network: string;
  tokenAmount: string;
  tokenPrice: string;
  chainId: number;
  contractAddress: string;
}

export interface NftDataProps {
  id: number;
  avatar: any;
  name: string;
  description: string;
  date: string;
  contract_address: string;
  token_Id: string;
  interface: string;
  openseaUrl: string;
}
