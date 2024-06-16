import { Event } from '@/entities/event';

import { backendClient } from './backend.config';

export const getEventsByIds = async (ids: number[]) => {
  if (ids.length === 0) return [];
  const query = {
    id: {
      in: ids,
    },
  };

  const res = await backendClient
    .get(`api/events?where=${JSON.stringify(query)}`)
    .json<{ docs: Event[] }>();

  // TODO: Remove this mock data
  if (res.docs) {
    return [
      {
        id: 1,
        title: 'ArtsDAOFest 2025',
        description:
          'Thanks to the enormous success of **WCD Pool Sessions** at the beginning of September, Frankfurt-based event specialist **BigCityBeats** inspired hope throughout Germany’s event and festival industry, providing with it a renewed sense of optimism',
        agenda:
          'Thanks to the enormous success of **WCD Pool Sessions** at the beginning of September, Frankfurt-based event specialist **BigCityBeats** inspired hope throughout Germany’s event and festival industry, providing with it a renewed sense of optimism',
        image: {
          url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        startDate: new Date(),
        endDate: new Date(),
        quests: [
          {
            id: 1,
            title: 'Quest 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            isPending: true,
            verification: '{}',
          },
          {
            id: 2,
            title: 'Quest 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            isPending: false,
            verification: '{}',
          },
        ],
      },
    ];
  }

  return res.docs;
};

export const getEventById = async (id: number) => {
  const res = await backendClient.get(`api/events/${id}`).json<Event>();

  if (res) {
    return {
      id: 1,
      title: 'ArtsDAOFest 2025',
      description:
        'Thanks to the enormous success of **WCD Pool Sessions** at the beginning of September, Frankfurt-based event specialist **BigCityBeats** inspired hope throughout Germany’s event and festival industry, providing with it a renewed sense of optimism',
      agenda:
        'Thanks to the enormous success of **WCD Pool Sessions** at the beginning of September, Frankfurt-based event specialist **BigCityBeats** inspired hope throughout Germany’s event and festival industry, providing with it a renewed sense of optimism',
      image: {
        url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      startDate: new Date(),
      endDate: new Date(),
      quests: [
        {
          id: 1,
          title: 'Quest 1',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
          image: {
            url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          },
          isPending: true,
          verification: '{}',
        },
        {
          id: 2,
          title: 'Quest 2',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
          image: {
            url: 'https://plus.unsplash.com/premium_photo-1688678097425-00bba1629e32?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          },
        },
      ],
    };
  }

  return res;
};

export const checkInEvent = async (eventId: number) =>
  backendClient.post(`api/events/${eventId}/check-in`).json<void>();
