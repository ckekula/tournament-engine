import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Organization } from 'src/entities/organization.entity';

const microOrmConfig: Options = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  dbName: 'tms',
  entities: [User, Organization],
  ensureDatabase: true,
  debug: true,
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
};

export default microOrmConfig;