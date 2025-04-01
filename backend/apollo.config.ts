import { ApolloDriver } from "@nestjs/apollo";

const config = {

    client: {
        service: {
            name: 'graphql',
            url: 'http://localhost:4000/graphql',
        },
    }
}

export default config;