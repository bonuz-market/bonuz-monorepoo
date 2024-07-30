import { useState } from 'react'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { setupUserInterceptor } from '@/lib/services'
import { backendBaseUrl } from './config'

// // Initialize Apollo Client
// const client = new ApolloClient({
//   // uri: 'https://bonuz-admin-wts46rwpca-ey.a.run.app/api/graphql',
//   uri: 'https://subgraph.satsuma-prod.com/bec5fd335898/muzzamils-team--1669084/bonuz-social-id-base-mainnet/api',
//   cache: new InMemoryCache(),
// })

const uri = `${backendBaseUrl}/api/graphql`;
const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});


export default ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  const navigate = (path: string) => { }

  setupUserInterceptor(navigate);


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          {children}

          {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
        </ApolloProvider>
      </QueryClientProvider>
    </>
  )
}
