import { AppView } from '@/entities/discovery';

import { backendClient } from './backend.config';

export const getFeaturedItems = async () => {
  // TODO: Fetch featured items from the backend.
  return [
    {
      image: require('@/assets/images/home/banner.png'),
    },
    {
      image: require('@/assets/images/home/banner.png'),
    },
    {
      image: require('@/assets/images/home/banner.png'),
    },
  ];
};

export const getRealWorldData = async () =>
  backendClient
    .get('api/realworld', {
      searchParams: {
        markdown: true,
      },
    })
    .json<AppView['RealWorlds']>();

export const getDigitalWorldData = async () =>
  backendClient
    .get('api/digitalworld', {
      searchParams: {
        markdown: true,
      },
    })
    .json<AppView['DigitalWorlds']>();
