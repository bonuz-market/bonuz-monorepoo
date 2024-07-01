import { BiconomySmartAccountV2 } from '@biconomy/account';

import { smartAccountSdkByChainId } from '@/store/smartAccounts';

/**
 * Types
 */
interface IInitArgs {
  wallet?: BiconomySmartAccountV2;
}

/**
 * Library
 */
export default class EIP155Lib {
  wallet: BiconomySmartAccountV2;

  constructor(wallet: BiconomySmartAccountV2) {
    this.wallet = wallet;
  }

  static init({ wallet }: IInitArgs) {
    if (!wallet) {
      throw new Error('wallet is not connected');
    }

    return new EIP155Lib(wallet);
  }

  async getAddress() {
    return this.wallet.getAccountAddress();
  }

  signMessage(message: string, chainId: number) {
    const sdk = smartAccountSdkByChainId[chainId];
    return sdk.signMessage(message);
  }

  _signTypedData(domain: any, types: any, data: any, chainId: number) {
    const sdk = smartAccountSdkByChainId[chainId];

    return sdk.signTypedData({ domain, types, message: data });
  }

  async sendTransaction(transaction: any, chainId: number) {
    const sdk = smartAccountSdkByChainId[chainId];

    const { waitForTxHash } = await sdk.sendTransaction({
      ...transaction,
    });

    const { transactionHash } = await waitForTxHash();

    return transactionHash;
  }

  signTransaction(transaction: any, chainId: number) {
    const sdk = smartAccountSdkByChainId[chainId];
    return sdk.getSigner().inner.signTransaction(transaction);
  }
}
