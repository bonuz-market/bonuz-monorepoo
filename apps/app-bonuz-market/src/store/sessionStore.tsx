import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SessionState {
  token: string;
  setToken: (token: string) => void;
  resetToken: () => void;
}

const initialState = {
  token: '',
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token: string) => {
        set((state) => ({
          ...state,
          token,
        }));
      },
      resetToken: () => {
        set(() => ({
          ...initialState,
        }));
      },
    }),
    {
      name: 'session',
    },
  ),
);
