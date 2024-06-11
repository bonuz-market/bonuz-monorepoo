import { Address, privateKeyToAccount } from 'viem/accounts';

export const fromPrivateKeyToWallet = (privateKey: string) => {
  const _privateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  return privateKeyToAccount(_privateKey as Address);
};

export const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
