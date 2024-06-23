import { Message } from '@/entities/message';

import { backendClient } from '../backend.config';

export const getMessages = async (page: number = 0) => {
  return backendClient
    .get('api/messages', {
      searchParams: {
        page,
      },
    })
    .json<{
      messages: {
        data: Message[];
        pageCount: number;
        next: number | null;
      };
    }>();
};

export const sendMessage = async (message: string) => {
  return backendClient.post('api/messages', { json: { message } });
};
