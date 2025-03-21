import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Organization } from 'src/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

const microOrmConfig = (config: ConfigService): Options => ({
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  user: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  dbName: config.get('DB_NAME'),
  entities: [User, Organization],
  ensureDatabase: true,
  debug: true,
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
});

export default microOrmConfig;