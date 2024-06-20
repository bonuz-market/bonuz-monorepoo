/* eslint-disable sonarjs/no-identical-functions */
import { NftDataProps, TokenDataProps, TransactionDataProps } from '@/entities/wallet';
import { networkTypes } from '@/store/walletTypes';

import { backendClient } from './backend.config';

export const getTokenDataByWalletAddress = async (
  walletAddress: string,
  networkType: number,
  setLoading: any,
) => {
  console.log('params:', walletAddress, networkType);
  if (walletAddress === undefined || networkType === undefined) return [];
  const res = await backendClient
    .get(`api/users/wallet/${walletAddress}/balance?chainId=${networkTypes[networkType].chainId}`)
    .json<{ data: TokenDataProps }>();

  setLoading(false);
  console.log('data:', res.data.tokens);
  return res.data.tokens;
};

export const getNftDataByWalletAddress = async (
  walletAddress: string,
  networkType: number,
  setLoading: any,
) => {
  if (walletAddress === undefined || networkType === undefined) return [];

  const res = await backendClient
    .get(`api/users/wallet/${walletAddress}/nfts?chainId=${networkTypes[networkType].chainId}`)
    .json<{ data: NftDataProps }>();

  setLoading(false);
  return res.data.nfts;
};

export const getActivityDataByWalletAddress = async (
  walletAddress: string,
  networkType: number,
  setLoading: any,
) => {
  if (walletAddress === undefined || networkType === undefined) return [];

  const res = await backendClient
    .get(
      `api/users/wallet/${walletAddress}/transactions?chainId=${networkTypes[networkType].chainId}`,
    )
    .json<{ data: TransactionDataProps }>();

  setLoading(false);
  return res.data.transactions;
};

export const getActivityDataByTokenAddress = async (
  walletAddress: string,
  chainId: string,
  contractAddress: string,
  setLoading: any,
) => {
  if (walletAddress === undefined || chainId === undefined || contractAddress === undefined)
    return [];

  const res = await backendClient
    .get(
      `api/users/wallet/${walletAddress}/transactions?chainId=${chainId}&contractAddress=${contractAddress}`,
    )
    .json<{ data: TransactionDataProps }>();

  setLoading(false);
  return res.data.transactions;
};
