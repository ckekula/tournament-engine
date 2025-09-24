import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Tournament } from 'src/entities/tournament.entity';
import { Activity } from 'src/entities/activity.entity';
import { Event } from 'src/entities/event.entity';
import { Category } from 'src/entities/category.entity';
import { Stage } from 'src/entities/stage.entity';
import { Group } from 'src/entities/group.entity';
import { GroupStage } from 'src/entities/groupStage.entity';
import { Participant } from 'src/entities/participant.entity';
import { TeamMember } from 'src/entities/teamMember.entity';
import { Team } from 'src/entities/team.entity';
import { StageParticipant } from 'src/entities/stageParticipant.entity';
import { GroupStageParticipant } from 'src/entities/groupStageParticipant.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  synchronize: false,
  ssl: true,
  entities: [
    User, Organization, Tournament, Activity, Event, Category, Stage, GroupStage, Group,
    Participant, TeamMember, Team, StageParticipant, GroupStageParticipant,
  ],
  connectTimeoutMS: 30000,
});