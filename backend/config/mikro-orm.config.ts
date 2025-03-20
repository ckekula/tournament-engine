import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  dbName: 'tms',
  entities: [User],
  ensureDatabase: true,
  debug: true,
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
};

export default config;