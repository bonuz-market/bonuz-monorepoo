import { Address } from 'viem';

export interface Wallet {
  eoaAddress: Address;
  privateKey: string;
  address: Address;
}

export interface TokenDataProps {
  tokens: TokenData[];
}
export interface TokenData {
  id: string;
  address: string;
  name: string;
  balance: string;
  decimals: string;
  logoURI: number;
  symbol: string;
  quote: number;
  quoteRate: number;
  quoteRateChange24Hr: number;
  chainId: number;
}
export interface NftDataProps {
  nfts: NftData[];
}
export interface NftData {
  content: {
    preview: {
      url: string;
    };
  };
  contract_address: string;
  name: string;
  token_id: string;
  description: string;
  external_url: string;
  last_transferred_at: string;
}

export interface TransactionDataProps {
  transactions: TransactionData[];
}
export interface TransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  quote: number;
  explorerUrl: string;
}
