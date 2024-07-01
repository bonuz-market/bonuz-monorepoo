import { RELAYER_EVENTS } from '@walletconnect/core';
import { parseUri } from '@walletconnect/utils';
import { useCallback, useEffect } from 'react';

import { Wallet } from '@/entities';
import { useUserStore } from '@/store';

import Emitter from '../../services/emitter';
import Modal from './components/Modal';
import useInitializeWeb3Wallet from './hooks/useInitializeWeb3Wallet';
import useWalletConnectEventsManager from './hooks/useWalletConnectEventsManager';
import { web3wallet } from './utils/WalletConnectUtil';

export const WalletConnect = () => {
  const initialized = useInitializeWeb3Wallet();

  useWalletConnectEventsManager(initialized);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    web3wallet.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log('Network connection is restored!');
    });

    web3wallet.core.relayer.on(RELAYER_EVENTS.disconnect, () => {
      console.log('Network connection lost.');
    });
  }, [initialized]);

  const address = useUserStore((state) => (state.wallet as Wallet).address);

  const onPair = useCallback(
    async (uri: string) => {
      try {
        if (!address) {
          throw new Error('Wallet is not connected! Please Login to your wallet.');
        }

        const { version } = parseUri(uri);

        if (version === 1) {
          throw new Error('WalletConnect v1 is no longer supported!');
        }

        console.log('pairing');

        const client = web3wallet;
        await client.pair({ uri });
      } catch (error) {
        // Toast.show({
        //   title: error.message,
        //   variant: 'subtle',
        //   duration: 3000,
        // });
        console.log('error', error);
      }
    },
    [address],
  );

  useEffect(() => {
    Emitter.on('wcScan', onPair);

    return () => {
      Emitter.off('wcScan', onPair);
    };
  }, [onPair]);

  return <Modal />;
};
