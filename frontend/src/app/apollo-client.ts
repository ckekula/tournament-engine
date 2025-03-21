import { InMemoryCache } from '@apollo/client/core';
import { environment } from './environment';

const apolloClient = {
    uri: environment.graphqlUrl,
    cache: new InMemoryCache(),
    ssrMode: false
};

export default apolloClient;