import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Organization } from './src/entities/organization.entity';
import { Tournament } from './src/entities/tournament.entity';
import { Activity } from './src/entities/activity.entity';
import { Event } from './src/entities/event.entity';
import { Category } from './src/entities/category.entity';
import * as dotenv from 'dotenv';
import { Stage } from 'src/entities/stage.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  entities: [User, Organization, Tournament, Activity, Event, Category, Stage],
  migrations: ['src/migrations/*.ts'],
});
