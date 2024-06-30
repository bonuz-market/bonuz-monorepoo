import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LoginType, User } from '../types';

interface AccountState {
  isVerified: boolean;
  isOnboarding: boolean;
  isGuest: boolean;
  loginType: LoginType | null;
}

type UserAccount = User & AccountState;

export interface UserState extends UserAccount {
  setUser: (userInfo: Partial<UserAccount>) => void;
  resetUser: () => void;
}

const initialState = {
  id: '',
  email: '',
  name: '',
  handle: '',
  profilePicture: '',
  links: [],
  createdAt: '',
  isVerified: false,
  isOnboarding: false,
  isGuest: false,
  isCurrentConnection: false,
  loginType: null,
  walletAddress: '',
  smartAccountAddress: '',
  wallets: {},
  messagingApps: {},
  connections: [],
  socialsLinks:[]
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (userInfo: Partial<UserAccount>) => {
        set((state) => ({
          ...state,
          ...userInfo,
        }));
      },
      resetUser: () => {
        set(() => ({
          ...initialState,
        }));
      },
    }),
    {
      name: 'user',
    },
  ),
);
