import { InMemoryCache } from '@apollo/client/core';

const client = {
    uri: process.env['PUBLIC_GRAPHQL_URL'],
    cache: new InMemoryCache(),
    ssrMode: false
};

export default client;