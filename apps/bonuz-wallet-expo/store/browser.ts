import { create } from 'zustand';

import { NETWORKS } from '@/constants/networks';

interface BrowserState {
  chainId: number;
  walletType: 'Smart Wallet';
}

interface BrowserActions {
  setChainId: (chainId: number) => void;
}

export const useBrowserStore = create<BrowserState & BrowserActions>((set) => ({
  chainId: NETWORKS.BASE,
  walletType: 'Smart Wallet',
  setChainId: (chainId: number) => set({ chainId }),
}));
