import { Options } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';
import { Pool } from '@neondatabase/serverless';

const config: Options = {
  debug: true,
};

export default config;