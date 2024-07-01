import AsyncStorage from '@react-native-async-storage/async-storage';
import { Core } from '@walletconnect/core';
import { IWeb3Wallet, Web3Wallet } from '@walletconnect/web3wallet';
import Constants from 'expo-constants';

export let web3wallet: IWeb3Wallet;
export let currentETHAddress: string;

const ENV_PROJECT_ID =
  Constants.expoConfig?.extra?.walletConnectProjectId ??
  '<walletConnectProjectId must be set in app.json>';

const WALLET_CONNECT_METADATA =
  Constants.expoConfig?.extra?.walletConnectMetadata ??
  '<walletConnectMetadata must be set in app.json>';

export async function createWeb3Wallet(relayerRegionURL?: string) {
  const core = new Core({
    projectId: ENV_PROJECT_ID,
  });
  web3wallet = await Web3Wallet.init({
    core,
    metadata: WALLET_CONNECT_METADATA,
  });

  try {
    const clientId = await web3wallet.engine.signClient.core.crypto.getClientId();
    console.log('WalletConnect ClientID:', clientId);
    AsyncStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId);
  } catch (error) {
    console.error('Failed to set WalletConnect clientId in localStorage:', error);
  }
}

export async function updateSignClientChainId(chainId: string, address: string) {
  console.log('chainId', chainId, address);
  // get most recent session
  const sessions = web3wallet.getActiveSessions();
  if (!sessions) {
    return;
  }
  const namespace = chainId.split(':')[0];
  Object.values(sessions).forEach(async (session) => {
    await web3wallet.updateSession({
      topic: session.topic,
      namespaces: {
        ...session.namespaces,
        [namespace]: {
          ...session.namespaces[namespace],
          chains: [...new Set([chainId, ...(session.namespaces[namespace].chains || [])])],
          accounts: [
            ...new Set([`${chainId}:${address}`, ...session.namespaces[namespace].accounts]),
          ],
        },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const chainChanged = {
      topic: session.topic,
      event: {
        name: 'chainChanged',
        data: Number.parseInt(chainId.split(':')[1], 10),
      },
      chainId,
    };

    const accountsChanged = {
      topic: session.topic,
      event: {
        name: 'accountsChanged',
        data: [`${chainId}:${address}`],
      },
      chainId,
    };
    await web3wallet.emitSessionEvent(chainChanged);
    await web3wallet.emitSessionEvent(accountsChanged);
  });
}

export const setWalletAddress = async (address: string) => {
  currentETHAddress = address;
};
