import { create } from 'zustand';

interface UiState {
  isTabBarHidden: boolean;
}

interface UiActions {
  setIsTabBarHidden: (isTabBarHidden: boolean) => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  isTabBarHidden: false,
  setIsTabBarHidden: (isTabBarHidden: boolean) => set({ isTabBarHidden }),
}));
