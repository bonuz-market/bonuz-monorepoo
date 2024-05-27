import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Auth } from '@/entities/auth';
import { User } from '@/entities/user';
import { Wallet } from '@/entities/wallet';

import { userStoreKey } from './constants';

interface UserState {
  user: User;
  wallet: Wallet;
  auth: Auth;
}

interface PersistedState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

type UserStore = UserState | { user: {}; wallet: {}; auth: {} };

interface UserStoreActions {
  setUser: (user: Partial<User>) => void;
  setWallet: (wallet: Partial<Wallet>) => void;
  setAuth: (auth: Partial<Auth>) => void;
  clear: () => void;
}

const initialState = { user: {}, wallet: {}, auth: {} };

export const useUserStore = create<UserStore & (UserStoreActions & PersistedState)>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user: Partial<User>) => {
        set((state) => ({
          ...state,
          user: {
            ...state.user,
            ...user,
          },
        }));
      },
      setWallet: (wallet: Partial<Wallet>) => {
        set((state) => ({
          ...state,
          wallet: {
            ...state.wallet,
            ...wallet,
          },
        }));
      },
      setAuth: (auth: Partial<Auth>) => {
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            ...auth,
          },
        }));
      },
      clear: () => {
        set({
          user: undefined,
          wallet: undefined,
          auth: undefined,
        });
      },

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: userStoreKey,
      storage: createJSONStorage(() => ({
        setItem: async (key: string, value: string) => await SecureStore.setItemAsync(key, value),
        getItem: async (key: string) =>
          (await SecureStore.getItemAsync(key)) as Promise<string> | null,
        removeItem: async (key: string) => await SecureStore.deleteItemAsync(key),
      })),
      // eslint-disable-next-line unicorn/consistent-function-scoping
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
