import {
  MessagingApp,
  MessagingAppType,
  SocialAccount,
} from './socialAccounts';
import { Wallet } from './wallet';

export interface SocialLink {
  type: SocialAccount;
  handle: string;
  baseUrl: string;
  verified: boolean;
  isPublic: boolean;
}
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  handle: string | null;
  profilePicture: string | null;
  links: SocialLink[];
  socialsLinks: any
  wallets: Record<string, Wallet>;
  messagingApps: Record<string, MessagingApp>;
  createdAt: string;
  walletAddress: string;
  smartAccountAddress: string;
  connections: Connection[] | null;
  imageFile?: any;
  isCurrentConnection: boolean;
}

export type Connection = Omit<User, 'connections' | 'links'> & {
  links: Pick<SocialLink, 'handle' | 'type'>[];
};

// -------------------------------------
export interface UserProfileData {
  handle?: string;
  name: string;
  profileImage: string;
  id?: string;
  smartAccountAddress?: string;
  walletAddress?: string;
  links: {
    socialMedias: Record<
      string,
      {
        link: string;
        isPublic: boolean;
        icon: any;
        baseUrl: string;
      }
    >;
    blockchainsWallets: Record<
      string,
      {
        link: string;
        isPublic: boolean;
        icon: any;
        baseUrl: string;
      }
    >;
    messengers: Record<
      string,
      {
        link: string;
        isPublic: boolean;
        icon: any;
        baseUrl: string;
      }
    >;
    digitalIdentifiers: Record<
      string,
      {
        link: string;
        isPublic: boolean;
        icon: any;
        baseUrl: string;
      }
    >;
  };
}

export interface UserProfileUpdateData {
  handle: string;
  name: string;
  profileImage: string;
  socials: {
    platforms: string[];
    links: string[];
  };
  wallets: {
    platforms: string[];
    links: string[];
  };
  messagingApps: {
    platforms: string[];
    links: string[];
  };
  digitalIdentifiers: {
    platforms: string[];
    links: string[];
  };
}

// ----------------------
export interface CheckIns {
  id: string;
  createdAt: string;
  user: {
    id: string;
    walletAddress: string;
    smartAccountAddress: string;
    handle: string;
    createdAt: string;
  };
}

