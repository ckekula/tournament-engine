import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Tournament } from 'src/entities/tournament.entity';
import { Activity } from 'src/entities/activity.entity';
import { Event } from 'src/entities/event.entity';
import { Category } from 'src/entities/category.entity';
import { Stage } from 'src/entities/stage.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  synchronize: false,
  ssl: true,
  entities: [User, Organization, Tournament, Activity, Event, Category, Stage],
  connectTimeoutMS: 30000,
});