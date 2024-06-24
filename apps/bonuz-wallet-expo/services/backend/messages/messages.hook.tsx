import {
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { Message } from '@/entities/message';

import { getMessages } from './messages.service';

export const useUserMessages = (
  options?: Omit<
    UndefinedInitialDataInfiniteOptions<{
      messages: {
        data: Message[];
        pageCount: number;
        next: number | null;
      };
    }>,
    'getNextPageParam' | 'initialPageParam' | 'queryKey' | 'queryFn' | 'select'
  >,
) => {
  return useInfiniteQuery({
    ...options,
    queryKey: ['messages'],
    queryFn: async ({ pageParam }) => getMessages(pageParam as number),
    select: ({ pages, pageParams }) => {
      return {
        pages: pages?.map((page) => page.messages.data).flat(),
        pageParams,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.messages?.next ?? undefined;
    },
    initialPageParam: 0,
  });
};
