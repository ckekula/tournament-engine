import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import throttlerConfig from 'src/config/throttler.config';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AuthModule } from './modules/auth/auth.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { ActivityModule } from './modules/activity/activity.module';
import { EventModule } from './modules/event/event.module';
import { CategoryModule } from './modules/category/category.module';
import { StageModule } from './modules/stage/stage.module';
import { GroupModule } from './modules/group/group.module';
import { ParticipantModule } from './modules/participant/participant.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ThrottlerModule.forRoot(throttlerConfig),
    AuthModule,
    UserModule,
    OrganizationModule,
    TournamentModule,
    ActivityModule,
    EventModule,
    CategoryModule,
    StageModule,
    GroupModule,
    ParticipantModule,
  ],
  providers: [],
})
export class AppModule {}
