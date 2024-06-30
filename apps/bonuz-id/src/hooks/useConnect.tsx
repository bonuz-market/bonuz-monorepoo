// @ts-nocheck
'use client';

import { useEffect, useCallback } from 'react';

// import {
//   BiconomySmartAccount,
//   BiconomySmartAccountConfig,
//   DEFAULT_ENTRYPOINT_ADDRESS,
// } from '@biconomy/account';
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
  PaymasterMode,
  BiconomySmartAccountV2Config,
} from '@biconomy/account';
import { Bundler, IBundler } from '@biconomy/bundler';
import { ChainId } from '@biconomy/core-types';
import { BiconomyPaymaster, IPaymaster } from '@biconomy/paymaster';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { ethers } from 'ethers';
import { shallow } from 'zustand/shallow';

import {
  RPC_URL,
  bonuzTokensChainId,
  bonuzSocialIdChainId,
  CORE_DAO_MAINNET,
  BASE_MAINNET,
} from '../../config';
import {
  BonuzSocialId,
  BonuzTokens,
  contractAddresses,
} from '../constants/contracts';
import { authenticate, getAuthMessage } from '../lib/services';
import { useSessionStore } from '../store/sessionStore';
import { useUserStore } from '../store/userStore';
import { useBiconomyShallowStore } from './useBiconomyShallowStore';


const smartAccountConfigByChainId = {
  [ChainId.POLYGON_MUMBAI]: {
    chainId: ChainId.POLYGON_MUMBAI,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/80001/pxFfSjlF6.7dafeea0-6c6e-4611-b51a-8f4428fa51f3',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: ChainId.POLYGON_MUMBAI,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [ChainId.POLYGON_MAINNET]: {
    chainId: ChainId.POLYGON_MAINNET,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/137/zdx2Ha-3o.4a5005e2-1494-4fa8-8d5a-6d7910aa7d0c',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/137/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: ChainId.POLYGON_MAINNET,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [ChainId.MAINNET]: {
    chainId: ChainId.MAINNET,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/1/9q6DC05zD.3e95b09e-4832-4c24-9400-1bd7c2d04336',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/1/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: ChainId.MAINNET,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [ChainId.BSC_MAINNET]: {
    chainId: ChainId.BSC_MAINNET,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/56/gIrVvlASV.2809fa13-419c-4c36-a714-bbafe77213fa',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/56/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: ChainId.BSC_MAINNET,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  [ChainId.ARBITRUM_NOVA_MAINNET]: {
    chainId: ChainId.ARBITRUM_NOVA_MAINNET,
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/42170/hP_uA_d-i.a30417d0-7197-4a2e-8dda-e770783eaf07',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/42170/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: ChainId.ARBITRUM_NOVA_MAINNET,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
  // [CORE_DAO_MAINNET]: {
  //   bundler: new Bundler({
  //     bundlerUrl:
  //       "https://bundler.biconomy.io/api/v2/1116/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv", // https://docs.biconomy.io/docs/dashboard/keys
  //     chainId: CORE_DAO_MAINNET as any,
  //     // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  //   }),
  //   paymaster: new BiconomyPaymaster({
  //     paymasterUrl:
  //       "https://paymaster.biconomy.io/api/v1/1116/fuDTX650I.b5dbbfd7-a4f9-4ea1-a892-4e8d516a7c2b",
  //   }),
  //   chainId: CORE_DAO_MAINNET,
  //   rpcUrl: `https://rpc.coredao.org`,
  // },

  [BASE_MAINNET]: {
    chainId: BASE_MAINNET,
    rpcUrl: RPC_URL[BASE_MAINNET],
    paymasterConfig: {
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/8453/xMm42g6mM.de40747a-3dd6-4907-a619-b9d7e75a0d3f',
    },
    bundlerConfig: {
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/8453/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
      chainId: BASE_MAINNET,
      // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    },
  },
};

const bundler: IBundler = new Bundler({
  ...smartAccountConfigByChainId[bonuzTokensChainId].bundlerConfig,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  ...smartAccountConfigByChainId[bonuzTokensChainId].paymasterConfig,
});

const useConnect = () => {
  const {
    isInitialized,
    isConnected,
    smartAccount,
    web3auth,
    setIsInitialized,
    setSmartAccountAddress,
    setSmartAccount,
    setProvider,
    setBonuzTokensContract,
    setBonuzSocialIdContract,
  } = useBiconomyShallowStore();

  const { token, setToken } = useSessionStore(
    (state) => ({
      setToken: state.setToken,
      token: state.token,
    }),
    shallow,
  );

  const setUser = useUserStore((state) => state.setUser);

  const setupSmartAccount = useCallback(
    async (web3auth: Web3AuthNoModal | null) => {
      if (!web3auth?.provider) {
        setIsInitialized(true);

        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(
        web3auth.provider as any,
      );

      const signer = web3Provider.getSigner();

      setProvider(web3Provider);

      try {
        console.log('setting up smart account... ');
        const bonuzTokensRpcUrl = RPC_URL[bonuzTokensChainId];
        console.log("bonuzTokensRpcUrl ", bonuzTokensRpcUrl);

        const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
          signer,
          chainId: bonuzTokensChainId,
          // chainId: bonuzSocialIdChainId, 
          bundler,
          paymaster,
          rpcUrl: bonuzTokensRpcUrl,
        };

        const biconomySmartAccount = await createSmartAccountClient(
          biconomySmartAccountConfig,
        );
        console.log('Biconomy Smart Account', biconomySmartAccount);
        const smartAccountAddress = await biconomySmartAccount.getAccountAddress();
        console.log('Smart Account Address', smartAccountAddress);
        // biconomySmartAccount = await biconomySmartAccount.init();
        // console.log('biconomySmartAccount', biconomySmartAccount);

        setSmartAccount(biconomySmartAccount);
        setSmartAccountAddress(smartAccountAddress);

        // const { chainId } = biconomySmartAccount;
        const bonuzTokenContractAddress =
          contractAddresses[bonuzTokensChainId]?.BonuzTokens;
        const bonuzSocialIdContractAddress =
          contractAddresses[bonuzSocialIdChainId]?.BonuzSocialId;

        const bonuzTokensProvider = new ethers.providers.JsonRpcProvider(
          bonuzTokensRpcUrl,
        );

        const bonuzSocialIdRpcUrl = RPC_URL[bonuzSocialIdChainId];
        const bonuzSocialIdProvider = new ethers.providers.JsonRpcProvider(
          bonuzSocialIdRpcUrl,
        );

        const bonuzTokenContract = new ethers.Contract(
          bonuzTokenContractAddress,
          BonuzTokens.abi,
          // web3Provider
          bonuzTokensProvider,
        );

        const bonuzSocialIdContract = new ethers.Contract(
          bonuzSocialIdContractAddress,
          BonuzSocialId.abi,
          // web3Provider
          bonuzSocialIdProvider,
        );
        setBonuzTokensContract(bonuzTokenContract);
        setBonuzSocialIdContract(bonuzSocialIdContract);
        setIsInitialized(true);
      } catch (err) {
        console.log('error setting up smart account... ', err);
      }
    },
    [setProvider, setIsInitialized, setSmartAccount, setSmartAccountAddress, setBonuzTokensContract, setBonuzSocialIdContract],
  );

  const auth = useCallback(async () => {
    if (token) return;

    const eoaAddress = await smartAccount?.signer?.getAddress(); // if we use smart account address then it throws invalid signature error
    const smartAccountAddress = await smartAccount.getAccountAddress();

    const messageReq = await getAuthMessage(eoaAddress);

    const { message } = messageReq.data;

    const { signer } = smartAccount;
    const signature = await signer.signMessage(message);


    // const eoaAddress = await smartAccount?.getAccountAddress(); // if we use smart account address then it throws invalid signature error
    // const smartAccountAddress = await smartAccount.getAccountAddress();

    // const messageReq = await getAuthMessage(eoaAddress);

    // const { message } = messageReq.data;
    // const signature = await smartAccount.signMessage(message);

    try {
      const authReq = await authenticate(
        eoaAddress,
        signature,
        smartAccountAddress,
      );

      const { token } = authReq.data;
      setToken(token);

      setUser({
        isGuest: false,
      });
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setToken('');

        setUser({
          isGuest: true,
        });
      }
    }
  }, [smartAccount, token, setToken, setUser]);

  useEffect(() => {
    if (web3auth?.status === 'connected' && !smartAccount) {
      setupSmartAccount(web3auth);
      return;
    }

    if (isConnected && !smartAccount) {
      setupSmartAccount(web3auth);
      return;
    }

    if (smartAccount) {
      auth();
    }
  }, [setupSmartAccount, web3auth, auth, smartAccount, isConnected]);

  return {
    isInitialized,
  };
};

export default useConnect;
