import qs from 'qs';

import { AppView, Partner } from '@/entities/discovery';

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

export const getRealWorldData = async (category?: string) => {
  let filter = '';

  console.log(category, 'category:inside');

  if (category) {
    const query = {
      title: {
        equals: category,
      },
    };

    filter = qs.stringify({
      where: query,
    });
  }

  console.log(filter, 'filter');
  return backendClient.get(`api/realworld?${filter}&markdown=true`).json<AppView['RealWorlds']>();
};

export const getRealWorldItemById = async (id: number) => {
  return backendClient.get(`api/partners/${id}?markdown=true`).json<Partner>();
};

export const getDigitalWorldData = async (category?: string) => {
  let filter = '';

  console.log(category, 'category:inside');

  if (category) {
    const query = {
      title: {
        equals: category,
      },
    };

    filter = qs.stringify({
      where: query,
    });
  }

  console.log(filter, 'filter');

  return backendClient
    .get(`api/digitalworld?${filter}&markdown=true`)
    .json<AppView['DigitalWorlds']>();
};
