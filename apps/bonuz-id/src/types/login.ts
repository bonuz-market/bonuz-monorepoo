export const LOGIN_TYPES = {
  GOOGLE: 'google',
  WALLET_CONNECT: 'wallet_connect',
  WALLET_IMPORT: 'wallet_import',
} as const;

export type LoginType = (typeof LOGIN_TYPES)[keyof typeof LOGIN_TYPES];
