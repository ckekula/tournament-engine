import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Organization } from 'src/entities/organization.entity';

const microOrmConfig: Options = {
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT']),
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  dbName: process.env['DB_NAME'],
  entities: [User, Organization],
  ensureDatabase: true,
  debug: true,
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
};

export default microOrmConfig;