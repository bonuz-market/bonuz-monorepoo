import { useEffect, useState } from 'react';

import { shallow } from 'zustand/shallow';

/**
 * Use this function when you want to fix the "hydration" error in NextJS
 * @param store
 * @param callback
 */
export const useAsyncStore = <T, F>(
  store: (callback: (state: T) => unknown, equals?: typeof shallow) => unknown,
  callback: (state: T) => F,
  equals?: typeof shallow,
) => {
  const result = store(callback, equals) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
