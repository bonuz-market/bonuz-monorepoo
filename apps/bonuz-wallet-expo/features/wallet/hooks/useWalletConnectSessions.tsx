import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

import Emitter from '../../../services/emitter';
import SettingsStore from '../store/SettingsStore';
import { web3wallet as client, web3wallet } from '../utils/WalletConnectUtil';

export const useWalletConnectSessions = () => {
  const { sessions } = useSnapshot(SettingsStore.state);

  const updateActiveSessions = useCallback(() => {
    SettingsStore.setSessions(Object.values(client?.getActiveSessions() ?? {}));
  }, []);

  const disconnectSession = useCallback(
    async (session: SessionTypes.Struct) => {
      try {
        const client = web3wallet;
        await client.disconnectSession({
          topic: session.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
        updateActiveSessions();
      } catch (error: unknown) {
        // Sentry.Native.captureException(error);
        console.log('Error for disconnecting', error);
      }
    },
    [updateActiveSessions],
  );

  useEffect(() => {
    updateActiveSessions();

    Emitter.on('walletConnectSessionCreated', updateActiveSessions);

    return () => {
      Emitter.off('walletConnectSessionCreated', updateActiveSessions);
    };
  }, [updateActiveSessions]);

  return { activeSessions: sessions, reload: updateActiveSessions, disconnectSession };
};
