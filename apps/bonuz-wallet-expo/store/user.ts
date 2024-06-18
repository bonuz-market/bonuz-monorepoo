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
  events: number[];
}

interface PersistedState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

type UserStore = UserState | { user: {}; wallet: {}; auth: {}; events: number[] };

interface UserStoreActions {
  setUser: (user: Partial<User>) => void;
  setWallet: (wallet: Partial<Wallet>) => void;
  setAuth: (auth: Partial<Auth>) => void;
  addEvent: (event: number) => void;
  removeEvent: (event: number) => void;
  clear: () => void;
}

const initialState = { user: {}, wallet: {}, auth: {}, events: [] };

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
      addEvent: (event: number) => {
        set((state) => ({
          ...state,
          events: [...state.events, event],
        }));
      },
      removeEvent: (event: number) => {
        set((state) => ({
          ...state,
          events: state.events.filter((e) => e !== event),
        }));
      },
      clear: () => {
        set({
          user: {},
          wallet: {},
          auth: {},
          events: [],
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
