import { BiconomySmartAccountV2 } from '@biconomy/account';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { create } from 'zustand';

import {
  BonuzSocialId,
  BonuzTokens,
} from '../constants/contracts/types/contracts';

interface StoreState {
  web3auth: Web3AuthNoModal | null;
  smartAccountAddress: string;
  smartAccount: BiconomySmartAccountV2 | null;
  provider: any;
  isConnected: boolean;
  isInitialized: boolean;
  bonuzTokensContract: BonuzTokens | null;
  bonuzSocialIdContract: BonuzSocialId | null;
}

export interface BiconomyState extends StoreState {
  setSmartAccountAddress: (account: string) => void;
  setSmartAccount: (account: any) => void;
  setProvider: (provider: any) => void;
  setWeb3auth: (web3auth: Web3AuthNoModal) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  setBonuzTokensContract: (contract: any) => void;
  setBonuzSocialIdContract: (contract: any) => void;
  resetBiconomyStore: () => void;
}

const initialState = {
  web3auth: null,
  smartAccountAddress: '',
  smartAccount: null,
  provider: null,
  isConnected: false,
  isInitialized: false,
  bonuzTokensContract: null,
  bonuzSocialIdContract: null,
};

// export const useBiconomyStore = create<BiconomyState>()(
//   persist(
//     (set) => ({
//       ...initialState,
//       setSmartAccount: (smartAccount: BiconomySmartAccountV2) => {
//         set((state) => ({
//           ...state,
//           smartAccount
//         }))
//       },
//       setProvider: (provider: any) => {
//         set((state) => ({
//           ...state,
//           provider
//         }))
//       },
//       resetBiconomyStore: () => {
//         set(() => ({
//           ...initialState
//         }))
//       }
//     }),
//     {
//       name: 'biconomy'
//     }
//   )
// )

export const useBiconomyStore = create<BiconomyState>((set) => ({
  ...initialState,
  setIsInitialized: (isInitialized) =>
    set({
      isInitialized,
    }),
  setIsConnected: (isConnected) =>
    set({
      isConnected,
    }),
  setSmartAccountAddress: (account) =>
    set({
      smartAccountAddress: account,
      isConnected: !!account,
    }),
  setSmartAccount: (account) =>
    set({
      smartAccount: account,
      isConnected: !!account,
    }),
  setProvider: (provider) =>
    set({
      provider,
    }),
  setWeb3auth: (web3auth) =>
    set({
      web3auth,
    }),
  setBonuzTokensContract: (bonuzContract) =>
    set({
      bonuzTokensContract: bonuzContract,
    }),
  setBonuzSocialIdContract: (bonuzSocialIdContract) =>
    set({
      bonuzSocialIdContract,
    }),
  resetBiconomyStore: () =>
    set({
      ...initialState,
    }),
}));
