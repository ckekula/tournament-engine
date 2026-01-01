import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Organization } from './src/entities/organization.entity';
import { Tournament } from './src/entities/tournament.entity';
import { Activity } from './src/entities/activity.entity';
import { Event } from './src/entities/event.entity';
import { Category } from './src/entities/category.entity';
import { Stage } from 'src/entities/stage.entity';
import { Group } from 'src/entities/group.entity';
import { GroupStage } from 'src/entities/groupStage.entity';
import { Participant } from 'src/entities/participant.entity';
import { TeamMember } from 'src/entities/teamMember.entity';
import { Team } from 'src/entities/team.entity';
import { StageParticipant } from 'src/entities/stageParticipant.entity';
import { GroupStageParticipant } from 'src/entities/groupStageParticipant.entity';
import * as dotenv from 'dotenv';
import { Person } from 'src/entities/person.entity';
import { Individual } from 'src/entities/Individual.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  entities: [
    User, Organization, Tournament, Activity, Event, Category, Stage, GroupStage, Group,
    Person, Participant, TeamMember, Team, Individual, StageParticipant, GroupStageParticipant,
  ],
  migrations: ['src/migrations/*.ts'],
});
