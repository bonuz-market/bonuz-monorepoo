import { useInfiniteQuery } from '@tanstack/react-query';

import { getMessages } from './messages.service';

export const useUserMessages = () => {
  return useInfiniteQuery({
    queryKey: ['messages'],
    queryFn: async ({ pageParam }) => getMessages(pageParam),
    select: ({ pages, pageParams }) => {
      const newPages = pages.map(({ messages }) => {
        return {
          messages: {
            data: messages.data,
            pageCount: messages.pageCount,
            next: messages.next,
          },
        };
      });
      return {
        pages: newPages,
        pageParams,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.messages?.next ?? undefined;
    },
    initialPageParam: 0,
  });
};
