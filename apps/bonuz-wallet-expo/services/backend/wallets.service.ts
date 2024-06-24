import { NftDataProps, TokenDataProps, TransactionDataProps } from '@/entities/wallet';
import { networkTypes } from '@/store/walletTypes';

import { backendClient } from './backend.config';

export const getTotalBalanceByWallet = async (walletAddress: string) => {
  if (walletAddress === undefined) return 0;
  const res = await backendClient
    .get(`api/users/wallet/${walletAddress}/balance`)
    .json<{ data: TokenDataProps }>();
  let balance = 0;
  for (let i = 0; i < res.data.tokens.length; i++)
    balance = balance + Number(res.data.tokens[i].balance);
  return balance;
};

export const getTokenDataByWalletAddress = async (
  walletAddress: string,
  networkType: number,
  setLoading: any,
) => {
  if (walletAddress === undefined || networkType === undefined) return [];
  const res = await backendClient
    .get(`api/users/wallet/${walletAddress}/balance?chainId=${networkTypes[networkType].chainId}`)
    .json<{ data: TokenDataProps }>();

  setLoading(false);
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
