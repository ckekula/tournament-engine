import { ApolloDriver } from "@nestjs/apollo";

const apolloConfig = {
    driver: ApolloDriver,
    autoSchemaFile: true,
    playground: true,
}

export default apolloConfig;