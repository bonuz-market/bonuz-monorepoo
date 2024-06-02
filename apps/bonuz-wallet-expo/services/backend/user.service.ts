import { User } from '@/entities/user';

import { backendClient } from './backend.config';

export const getUserInfo = async (accessToken: string) => {
  return backendClient
    .get(`api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<User>();
};
