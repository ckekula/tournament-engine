import { ApolloDriver } from "@nestjs/apollo";

const config = {
    driver: ApolloDriver,
    autoSchemaFile: true,
    playground: true,
}

export default config;