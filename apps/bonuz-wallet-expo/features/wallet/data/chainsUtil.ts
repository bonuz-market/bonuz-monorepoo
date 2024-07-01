import { EIP155_CHAINS } from './EIP155';

export const ALL_CHAINS = {
  ...EIP155_CHAINS,
};

export function getChainData(chainId?: string) {
  if (!chainId) {
    return;
  }
  const [namespace, reference] = chainId.toString().split(':');
  return Object.values(ALL_CHAINS).find(
    (chain) => chain.chainId.toString() === reference && chain.namespace === namespace,
  );
}
