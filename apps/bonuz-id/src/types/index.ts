export * from './login';
export * from './socialAccounts';
export * from './user';
export * from './common';

// -------------------------
export enum NewPartnerStatus {
  IN_REVIEW = 'IN_REVIEW',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

// -------------------------
export enum TokenType {
  VOUCHER = 'VOUCHER',
  POP = 'POP',
  LOYALTY = 'LOYALTY',
  CERTIFICATE = 'CERTIFICATE',
  MEMBERSHIP = 'MEMBERSHIP',
}