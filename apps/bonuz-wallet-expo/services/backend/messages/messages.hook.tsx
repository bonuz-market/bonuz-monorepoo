import { useInfiniteQuery } from '@tanstack/react-query';

import { getMessages } from './messages.service';

export const useUserMessages = () => {
  return useInfiniteQuery({
    queryKey: ['messages'],
    queryFn: async ({ pageParam }) => getMessages(pageParam),
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
