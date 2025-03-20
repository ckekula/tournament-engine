import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import microOrmConfig from 'config/mikro-orm.config';
import apolloConfig from 'config/apollo.config';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(microOrmConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>(apolloConfig),
    UserModule,
    OrganizationModule
  ],
})
export class AppModule {}
