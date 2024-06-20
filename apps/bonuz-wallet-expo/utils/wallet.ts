import { Address, privateKeyToAccount } from 'viem/accounts';

export const fromPrivateKeyToWallet = (privateKey: string) => {
  const _privateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  return privateKeyToAccount(_privateKey as Address);
};

export const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export const convertDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const shortenDiscription = (description: string, prefixLength: number) => {
  if (!description || description.length < prefixLength) {
    return description; // If the address is too short, return as is
  }

  const prefix = description.slice(0, prefixLength);

  return `${prefix}...`;
};

export const formatPrice = (num: number) => {
  return Number(num.toFixed(5));
};
