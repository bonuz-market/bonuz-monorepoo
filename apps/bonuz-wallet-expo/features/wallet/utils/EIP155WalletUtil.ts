import { NETWORKS } from '@/constants/networks';
import { smartAccountSdkByChainId } from '@/store/smartAccounts';

import EIP155Lib from '../lib/EIP155';
import { setWalletAddress } from './WalletConnectUtil';

export let wallet1: EIP155Lib;
export let wallet2: EIP155Lib;
export let eip155Wallets: Record<string, EIP155Lib>;
export let eip155Addresses: string[];

export let address1: string;
let address2: string;

export async function createOrRestoreEIP155Wallet() {
  wallet1 = EIP155Lib.init({
    wallet: smartAccountSdkByChainId[NETWORKS.ETHEREUM],
  });

  address1 = await smartAccountSdkByChainId[NETWORKS.ETHEREUM].getAccountAddress();
  setWalletAddress(address1);
  eip155Wallets = {
    [address1]: wallet1,
    [address2]: wallet2,
  };
  eip155Addresses = Object.keys(eip155Wallets);

  return {
    eip155Wallets,
    eip155Addresses,
  };
}
