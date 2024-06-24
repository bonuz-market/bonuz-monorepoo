import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';

import { SOCIAL_ID_SUBGRAPH_URL } from '../../bonuz.config';

export const socialIdSubgraphApolloClient = new ApolloClient({
  uri: SOCIAL_ID_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

export const SocialIdSubgraphProvider = ({ children }) => {
  return <ApolloProvider client={socialIdSubgraphApolloClient}>{children}</ApolloProvider>;
};
