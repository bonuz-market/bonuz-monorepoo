import { NFTResponse } from '@/entities/nfts';
import { User } from '@/entities/user';

import { backendClient } from './backend.config';

type UserDb = Pick<User, 'id' | 'handle' | 'createdAt' | 'smartAccountAddress' | 'socialsLinks'>;
export const getUserInfo = async () => {
  return backendClient.get(`api/users/me`).json<UserDb>();
};

export const getUserByHandle = async (handle: string) => {
  const res = await backendClient.get(`api/users/${handle}`);

  return res.json<
    UserDb & {
      isCurrentConnection: boolean;
    }
  >();
};

export const updateUserInfo = async (userInfo: any) => {
  return backendClient.patch(`api/users/me?chainId=1116`, {
    json: userInfo,
  });
};

export const createUser = async (userData: {
  handle: string;
  name: string;
  profileImage?: string;
}) => {
  return backendClient
    .post(`api/users?chainId=1116`, {
      json: userData,
    })
    .json<UserDb>();
};

export const getUserConnections = async () => {
  return backendClient.get(`api/users/me/connections`).json<UserDb[]>();
};

export const addUserConnection = async (userId: number) => {
  return backendClient
    .post(`api/users/me/connections`, {
      json: { targetUserId: userId },
    })
    .json();
};

export const removeUserConnection = async (userId: number) => {
  return backendClient.delete(`api/users/me/connections/${userId}`).json();
};

export const getNftsByAddress = async (address: string) => {
  return backendClient.get(`api/users/wallet/${address}/nfts`).json<NFTResponse>();
};
