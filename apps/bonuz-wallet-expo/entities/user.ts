export interface Link {
  type: string;
  handle: string;
  isPublic: boolean;
  isVerified?: boolean;
}
export interface User {
  id: string;
  email: string;
  name: string;
  handle: string;
  profilePicture: string | null;
  socials: Record<string, Link>;
  wallets: Record<string, Link>;
  messagingApps: Record<string, Link>;
  decentralizedIdentifiers: Record<string, Link>;
  createdAt: string;
  walletAddress: string;
  smartAccountAddress: string;
  connections: User[];
  socialsLinks: { type: string; isVerified: boolean }[];
}

export interface SocialIdUser {
  name: string;
  handle: string;
  profilePicture: string | null;
  socials: Record<string, Link>;
  wallets: Record<string, Link>;
  messagingApps: Record<string, Link>;
  decentralizedIdentifiers: Record<string, Link>;
}
