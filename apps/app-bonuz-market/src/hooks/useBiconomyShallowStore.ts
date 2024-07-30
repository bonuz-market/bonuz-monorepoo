import {  BiconomySmartAccountV2 } from '@biconomy/account';
import { shallow } from 'zustand/shallow';

import { useBiconomyStore } from '../store/biconomyStore';

export const useBiconomyShallowStore = () =>
  useBiconomyStore(
    (state) => ({
      isConnected: state.isConnected,
      isInitialized: state.isInitialized,
      web3auth: state.web3auth,
      smartAccountAddress: state.smartAccountAddress,
      smartAccount: state.smartAccount as BiconomySmartAccountV2,
      provider: state.provider,
      bonuzTokensContract: state.bonuzTokensContract,
      bonuzSocialIdContract: state.bonuzSocialIdContract,
      setIsInitialized: state.setIsInitialized,
      setIsConnected: state.setIsConnected,
      setSmartAccountAddress: state.setSmartAccountAddress,
      setSmartAccount: state.setSmartAccount,
      setBonuzSocialIdContract: state.setBonuzSocialIdContract,
      setProvider: state.setProvider,
      setWeb3auth: state.setWeb3auth,
      setBonuzTokensContract: state.setBonuzTokensContract,
      resetBiconomyStore: state.resetBiconomyStore,
    }),
    shallow,
  );
