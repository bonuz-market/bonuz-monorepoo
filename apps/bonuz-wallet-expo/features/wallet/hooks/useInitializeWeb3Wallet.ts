import { useCallback, useEffect, useState } from 'react';

import { createWeb3Wallet } from '../utils/WalletConnectUtil';

export default function useInitializeWeb3Wallet() {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    try {
      await createWeb3Wallet();
      setInitialized(true);
    } catch (error: unknown) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}
