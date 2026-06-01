import { Module } from '@nestjs/common';
import { StageParticipantController } from './stage-participant.controller';
import { StageParticipantService } from './stage-participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from 'src/entities/participant.entity';
import { Event } from 'src/entities/event.entity';
import { GroupParticipant } from 'src/entities/groupStageParticipant.entity';
import { Group } from 'src/entities/group.entity';
import { StageParticipant } from 'src/entities/stageParticipant.entity';
import { GroupStage } from 'src/entities/groupStage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant, StageParticipant, GroupStage, GroupParticipant, Group, Event])],
  controllers: [StageParticipantController],
  providers: [StageParticipantService]
})
export class StageParticipantModule {}
