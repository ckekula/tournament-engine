import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Organization } from 'src/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

const microOrmConfig = (config: ConfigService): Options => ({
  clientUrl: config.get('DATABASE_URL'),
  entities: [User, Organization],
  ensureDatabase: true,
  debug: ['query', 'discovery', 'schema'],
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    connectTimeout: 30000,
  },
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
});

export default microOrmConfig;