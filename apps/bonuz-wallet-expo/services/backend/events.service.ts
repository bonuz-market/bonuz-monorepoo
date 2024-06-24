import qs from 'qs';

import { Event } from '@/entities/event';

import { BACKEND_ENDPOINT, backendClient } from './backend.config';

export const getEventsByIds = async (ids: number[]) => {
  if (ids.length === 0) return [];
  const query = {
    id: {
      in: ids,
    },
  };

  const filter = qs.stringify({
    where: query,
  });

  const res = await backendClient
    .get(`api/events?${filter}&markdown=true`)
    .json<{ docs: Event[] }>()
    .then((events) =>
      events.docs.map((event) => ({
        ...event,
        image: {
          url: `${BACKEND_ENDPOINT}${event.image.url}`,
        },
        challenges: event.challenges_new.map((challenge) => ({
          ...challenge,
          image: {
            url: `${BACKEND_ENDPOINT}${challenge.image.url}`,
          },
        })),
      })),
    );

  console.log(res, 'res.docs');

  return res;
};

export const getEventById = async (id: number) =>
  backendClient
    .get(`api/events/${id}`)
    .json<Event>()
    .then((event) => ({
      ...event,

      image: {
        url: `${BACKEND_ENDPOINT}${event.image.url}`,
      },
    }));

export const checkInEvent = async (eventId: number) =>
  backendClient.post(`api/events/${eventId}/check-in`).json<void>();
