import { resultTypes } from '@/types/typeResult';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { resultTypesStoreKey } from './constants';

interface ResultTypeState {
    digitalTypes: resultTypes[];
    realWorldTypes: resultTypes[];
}

interface PersistedState {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

type ResultTypeStore = ResultTypeState | { digitalTypes: []; realWorldTypes: [] };

interface ResultTypeStoreActions {
    setDigitalTypes: (digitalTypes: Partial<resultTypes[]>) => void;
    setRealWorldTypes: (realWorldTypes: Partial<resultTypes[]>) => void;
    clear: () => void;
}

const initialState = { digitalTypes: [], realWorldTypes: [] };

export const useResultTypeStore = create<ResultTypeStore & (ResultTypeStoreActions & PersistedState)>()(
    persist(
        (set, get) => ({
            ...initialState,
            setDigitalTypes: (digitalTypes: Partial<resultTypes>) => {
                set((state) => ({
                    ...state,
                    digitalTypes: {
                        ...state.digitalTypes,
                        ...digitalTypes,
                    },
                }));
            },
            setRealWorldTypes: (realWorldTypes: Partial<resultTypes>) => {
                set((state) => ({
                    ...state,
                    realWorldTypes: {
                        ...state.realWorldTypes,
                        ...realWorldTypes,
                    },
                }));
            },
            clear: () => {
                set({
                    digitalTypes: [],
                    realWorldTypes: []
                })
            },
            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },
        }),
        {
            name: resultTypesStoreKey,
            storage: createJSONStorage(() => ({
                setItem: (key: string, value: string) => localStorage.setItem(key, value),
                getItem: (key: string) =>
                    (localStorage.getItem(key)) as string | null,
                removeItem: (key: string) => localStorage.deleteItem(key),
            })),
            // eslint-disable-next-line unicorn/consistent-function-scoping
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    )
)