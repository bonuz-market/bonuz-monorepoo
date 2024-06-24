import { BiconomySmartAccountV2, createSmartAccountClient } from '@biconomy/account';
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';
import {
  Chain,
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
} from 'viem';
import {
  arbitrum,
  arbitrumNova,
  base,
  bsc,
  coreDao,
  mainnet,
  polygon,
  polygonMumbai,
} from 'viem/chains';

import { PROVIDERS } from '@/constants/networks';
import { fromPrivateKeyToWallet } from '@/utils/wallet';

export let smartAccountSdkByChainId: { [chainId: number]: BiconomySmartAccountV2 } = {};

export const chainByChainId = {
  [polygonMumbai.id]: polygonMumbai,
  [polygon.id]: polygon,
  [mainnet.id]: mainnet,
  [bsc.id]: bsc,
  [arbitrum.id]: arbitrum,
  [arbitrumNova.id]: arbitrumNova,
  [base.id]: base,
  [coreDao.id]: coreDao,
} as { [chainId: number]: Chain };

export const viemPublicClients = {
  [polygonMumbai.id]: createPublicClient({
    transport: http(PROVIDERS[polygonMumbai.id]),
  }),
  [polygon.id]: createPublicClient({
    transport: http(PROVIDERS[polygon.id]),
  }),
  [mainnet.id]: createPublicClient({
    transport: http(PROVIDERS[mainnet.id]),
  }),
  [bsc.id]: createPublicClient({
    transport: http(PROVIDERS[bsc.id]),
  }),
  [arbitrum.id]: createPublicClient({
    transport: http(PROVIDERS[arbitrum.id]),
  }),
  [arbitrumNova.id]: createPublicClient({
    transport: http(PROVIDERS[arbitrumNova.id]),
  }),
  [base.id]: createPublicClient({
    transport: http(PROVIDERS[base.id]),
  }),
  [coreDao.id]: createPublicClient({
    transport: http(PROVIDERS[coreDao.id]),
  }),
} as { [chainId: number]: PublicClient };

export let viemWalletClients = {} as { [chainId: number]: WalletClient };
export let bonuzSmartAccountSdk: BiconomySmartAccountV2 | undefined;
export let bonuzSmartAccountSigner: WalletClient | undefined;

const smartAccountConfigByChainId = {
  [polygonMumbai.id]: {
    chainId: polygonMumbai.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/80001/pxFfSjlF6.7dafeea0-6c6e-4611-b51a-8f4428fa51f3',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: polygonMumbai.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [polygon.id]: {
    chainId: polygon.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/137/zdx2Ha-3o.4a5005e2-1494-4fa8-8d5a-6d7910aa7d0c',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/137/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: polygon.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [mainnet.id]: {
    chainId: mainnet.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/1/9q6DC05zD.3e95b09e-4832-4c24-9400-1bd7c2d04336',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/1/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: mainnet.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [bsc.id]: {
    chainId: bsc.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/56/gIrVvlASV.2809fa13-419c-4c36-a714-bbafe77213fa',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/56/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: bsc.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [arbitrum.id]: {
    chainId: arbitrum.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/42161/YpSMrsCic.f7caf646-6e1d-40f1-a479-30b278558958',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/42161/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: arbitrum.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [arbitrumNova.id]: {
    chainId: arbitrumNova.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/42170/hP_uA_d-i.a30417d0-7197-4a2e-8dda-e770783eaf07',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/42170/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: arbitrumNova.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [base.id]: {
    chainId: base.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/8453/xMm42g6mM.de40747a-3dd6-4907-a619-b9d7e75a0d3f',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/8453/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: base.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [coreDao.id]: {
    chainId: coreDao.id,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/1116/fuDTX650I.b5dbbfd7-a4f9-4ea1-a892-4e8d516a7c2b',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/1116/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: coreDao.id,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
} as {
  [chainId: number]: { chainId: number; paymasterConfig: any; bundlerConfig: any };
};

const BONUZ_ACTIVE_CHAIN_ID = coreDao.id;

export const setSmartAccountSdk = async (
  privateKey: string,
  config: {
    chainId?: number;
    withCache?: boolean;
  },
) => {
  if (!privateKey) throw new Error('Private key is required');

  const { chainId = BONUZ_ACTIVE_CHAIN_ID, withCache = true } = config;

  const currentSdk = smartAccountSdkByChainId?.[chainId];
  // if new config is same as old config,
  // no need to init a new sdk instance
  if (currentSdk && withCache) return currentSdk;

  const account = fromPrivateKeyToWallet(privateKey);
  viemWalletClients[chainId] = createWalletClient({
    chain: chainByChainId[chainId],
    transport: http(PROVIDERS[chainId]),
    account,
  });

  return await createSmartAccountClient({
    chainId: chainId,
    paymaster: new BiconomyPaymaster(smartAccountConfigByChainId[chainId].paymasterConfig),
    bundlerUrl: smartAccountConfigByChainId[chainId].bundlerConfig.bundlerUrl,
    rpcUrl: PROVIDERS[chainId],
    signer: viemWalletClients[chainId],
  });
};

export const setupSmartAccountSdk = async (privateKey: string) => {
  if (!privateKey) throw new Error('Private key is required');

  try {
    const promises = Object.keys(smartAccountConfigByChainId).map(async (chainId) => {
      console.log('Setting smart account sdk for chainId', chainId);

      if (!smartAccountSdkByChainId[Number(chainId)]) {
        smartAccountSdkByChainId[Number(chainId)] = await setSmartAccountSdk(privateKey, {
          chainId: Number(chainId),
        });
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error setting smart account sdk', error);
  }
};

export const getSmartAccountSdk = (chainId: number) => {
  if (!smartAccountSdkByChainId[chainId]) {
    throw new Error('Smart account sdk not initialized');
  }

  return smartAccountSdkByChainId[chainId];
};

export const setBonuzSmartAccountSdk = async (privateKey: string) => {
  if (!privateKey) throw new Error('Private key is required');

  // if new config is same as old config,
  // no need to init a new sdk instance
  if (bonuzSmartAccountSdk) return bonuzSmartAccountSdk;

  console.log('Setting bonuz smart account sdk');

  const wallet = fromPrivateKeyToWallet(privateKey);
  if (!viemWalletClients[BONUZ_ACTIVE_CHAIN_ID]) {
    viemWalletClients[BONUZ_ACTIVE_CHAIN_ID] = createWalletClient({
      chain: chainByChainId[BONUZ_ACTIVE_CHAIN_ID],
      transport: http(PROVIDERS[BONUZ_ACTIVE_CHAIN_ID]),
      account: wallet,
    });
  }

  bonuzSmartAccountSigner = viemWalletClients[BONUZ_ACTIVE_CHAIN_ID];

  bonuzSmartAccountSdk = await createSmartAccountClient({
    chainId: BONUZ_ACTIVE_CHAIN_ID,
    paymaster: new BiconomyPaymaster(
      smartAccountConfigByChainId[BONUZ_ACTIVE_CHAIN_ID].paymasterConfig,
    ),
    bundlerUrl: smartAccountConfigByChainId[BONUZ_ACTIVE_CHAIN_ID].bundlerConfig.bundlerUrl,
    rpcUrl: PROVIDERS[BONUZ_ACTIVE_CHAIN_ID],
    signer: wallet,
  });

  return bonuzSmartAccountSdk;
};

export const reset = () => {
  smartAccountSdkByChainId = {};
  bonuzSmartAccountSdk = undefined;
  bonuzSmartAccountSigner = undefined;
  viemWalletClients = {};
};
