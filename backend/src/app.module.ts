import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import microOrmConfig from 'src/config/mikro-orm.config';
import apolloConfig from 'src/apollo.config';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ThrottlerModule } from '@nestjs/throttler';
import throttlerConfig from 'src/config/throttler.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { SchemaSyncService } from './schema-sync.service';

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
    AuthModule,
    UserModule,
    OrganizationModule
  ],
  providers: [SchemaSyncService],
})
export class AppModule {}
