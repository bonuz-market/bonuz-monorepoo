import { backendClient } from './backend.config';

export const authenticate = async ({
  walletAddress,
  smartAccountAddress,
  signature,
}: {
  walletAddress: string;
  smartAccountAddress: string;
  signature: string;
}) => {
  const res = await backendClient
    .post(`api/users/auth`, {
      json: {
        walletAddress,
        smartAccountAddress,
        signature,
      },
    })
    .json<{
      token: string;
    }>();

  const { token } = res;

  return token;
};

export const getVerificationMessage = async (walletAddress: string) =>
  backendClient
    .post(`api/users/auth/sign`, {
      json: {
        walletAddress,
      },
    })
    .json<{ message: string }>();
