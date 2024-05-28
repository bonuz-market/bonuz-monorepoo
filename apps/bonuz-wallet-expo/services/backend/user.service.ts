import { User } from '@/entities/user';

import { backendClient } from './backend.config';

type UserDb = Pick<User, 'id' | 'handle' | 'createdAt' | 'smartAccountAddress' | 'socialsLinks'>;
export const getUserInfo = async () => {
  return backendClient.get(`api/users/me`).json<UserDb>();
};

export const getUserByHandle = async (handle: string, accessToken?: string) => {
  const res = await backendClient.get(`api/users/${handle}`);

  return res.json<UserDb>();
};

export const updateUserInfo = async (userInfo: any) => {
  return backendClient
    .patch(`api/users/me?chainId=1116`, {
      json: userInfo,
    })
    .json();
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
