export type Wallet = string;

export interface Contract {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface Token extends Contract {
  balance: string;
  quote: number;
  quoteRate: number;
  quoteRateChange24Hr?: number;
  chainId?: number;
}

export interface Transaction {
  hash: string;
  success: boolean;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  quote: number;
  erc20Contract?: Contract & {
    chainId?: number;
  };
  explorerUrl?: string;
}

export interface WalletTransactions {
  pagination?: {
    hasMore: boolean;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  transactions: Transaction[];
}

export interface WalletAssets {
  tokens: Token[];
}

interface Preview {
  url: string;
  content_type?: string;
}

interface Detail {
  url: string;
  content_type?: string;
}

interface Audio {
  url: string;
  content_type?: string;
}

interface Video {
  url: string;
  content_type?: string;
}

interface NFTContent {
  preview?: Preview;
  detail?: Detail;
  audio?: Audio;
  video?: Video;
}
interface Attribute {
  key: string;
  value: string;
}
export interface NFT {
  contract_address: string;
  token_id: string | null;
  name: string;
  description?: string;
  external_url?: string;
  attributes?: Attribute[];
  interface?: string;
  content: NFTContent;
}

export interface WalletNFTs {
  nfts: NFT[];
}

export interface BlockchainService {
  getWalletBalance(
    wallet: Wallet,
    chainId?: number,
  ): Promise<Pick<WalletAssets, 'tokens'>>;
  getWalletTransactions(
    wallet: Wallet,
    chainId?: number,
    contractAddress?: string,
  ): Promise<WalletTransactions>;
  getWalletNFTs(wallet: Wallet): Promise<WalletNFTs>;
}
