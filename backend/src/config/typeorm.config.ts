import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { join } from 'path';
import { Tournament } from 'src/entities/tournament.entity';
import { Activity } from 'src/entities/activity.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  synchronize: config.get('TYPEORM_SYNC'),
  ssl: true,
  entities: [User, Organization, Tournament, Activity],
  connectTimeoutMS: 30000,
});