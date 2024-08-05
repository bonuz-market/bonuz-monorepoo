import { Partner } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

export interface AppStore {
  selectedPartner: Partner | null
  setSelectPartner: (partner: Partner | null) => void
}

const initialState = {
  selectedPartner: null,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectPartner: (selectedPartner) =>
        set({
          selectedPartner,
        }),
    }),
    {
      name: 'appStore',
    }
  )
)

export const useAppShallowStore = () =>
  useAppStore(
    (state) => ({
      selectedPartner: state.selectedPartner,
      setSelectPartner: state.setSelectPartner,
    }),
    shallow
  )
