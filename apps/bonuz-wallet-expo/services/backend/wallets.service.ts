/* eslint-disable sonarjs/no-identical-functions */
import { NftDataProps, TokenDataProps, TransactionDataProps } from '@/entities/wallet';
import { networkTypes } from '@/store/walletTypes';

import { backendClient } from './backend.config';

export const getTokenDataByWalletAddress = async (walletAddress: string, networkType: number) => {
  console.log('called', walletAddress, networkType);
  if (walletAddress === undefined || networkType === undefined) return [];

  //TODO: Replace BackendConfig
  const res = await backendClient
    .get(`api/users/wallet/${walletAddress}/balance?chainId=${networkTypes[networkType].chainId}`)
    .json<{ data: TokenDataProps }>();

  console.log(res.data.tokens);
  return res.data.tokens;
};

export const getNftDataByWalletAddress = async (walletAddress: string, networkType: number) => {
  console.log('nft called', walletAddress, networkType);
  if (walletAddress === undefined || networkType === undefined) return [];

  //TODO: Replace BackendConfig
  const res = await backendClient
    .get(`api/users/wallet/${walletAddress}/nfts?chainId=${networkTypes[networkType].chainId}`)
    .json<{ data: NftDataProps }>();

  console.log(res.data.nfts);
  return res.data.nfts;
};

export const getActivityDataByWalletAddress = async (
  walletAddress: string,
  networkType: number,
) => {
  console.log('activity called', walletAddress, networkType);
  if (walletAddress === undefined || networkType === undefined) return [];

  //TODO: Replace BackendConfig
  const res = await backendClient
    .get(
      `api/users/wallet/${walletAddress}/transactions?chainId=${networkTypes[networkType].chainId}`,
    )
    .json<{ data: TransactionDataProps }>();

  console.log(res.data.transactions);
  return res.data.transactions;
};
