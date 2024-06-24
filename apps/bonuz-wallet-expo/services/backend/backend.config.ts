import Constants from 'expo-constants';
import ky from 'ky';

import { Auth } from '@/entities';
import { useUserStore } from '@/store';
import { isNotEmpty } from '@/utils/object';

export const BACKEND_ENDPOINT =
  Constants.expoConfig?.extra?.backendUrl ?? '<backendUrl must be set in app.json>';

export let backendClient = ky.create({
  prefixUrl: BACKEND_ENDPOINT,
  headers: {
    'X-Source': 'Bonuz-App',
    Authorization: isNotEmpty(useUserStore.getState().auth)
      ? `Bearer ${(useUserStore.getState().auth as Auth).accessToken}`
      : undefined,
  },
});

const setAuthToken = (token: string) => {
  backendClient = backendClient.extend({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

useUserStore.subscribe((state) => {
  if (isNotEmpty(state.auth)) {
    setAuthToken(state.auth.accessToken);
  }
});
