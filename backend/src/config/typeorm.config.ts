import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { join } from 'path';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  synchronize: config.get('TYPEORM_SYNC'),
  ssl: true,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  connectTimeoutMS: 30000,
});