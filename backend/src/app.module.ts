import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import microOrmConfig from 'src/config/mikro-orm.config';
import apolloConfig from 'src/config/apollo.config';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ThrottlerModule } from '@nestjs/throttler';
import throttlerConfig from 'src/config/throttler.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: microOrmConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(apolloConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    UserModule,
    OrganizationModule
  ],
})
export class AppModule {}
