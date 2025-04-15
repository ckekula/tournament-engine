import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchemaSyncService } from './schema-sync.service';
import microOrmConfig from 'src/config/mikro-orm.config';
import throttlerConfig from 'src/config/throttler.config';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TournamentModule } from './modules/tournament/tournament.module';
import { ActivityModule } from './modules/activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: microOrmConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    ThrottlerModule.forRoot(throttlerConfig),
    AuthModule,
    UserModule,
    OrganizationModule,
    TournamentModule,
    ActivityModule,
  ],
  providers: [SchemaSyncService],
})
export class AppModule {}
