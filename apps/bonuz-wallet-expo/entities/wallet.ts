import { Address } from 'viem';

export interface Wallet {
  eoaAddress: Address;
  privateKey: string;
  address: Address;
}
