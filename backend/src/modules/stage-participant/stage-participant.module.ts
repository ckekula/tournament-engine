import { Module } from '@nestjs/common';
import { StageParticipantController } from './stage-participant.controller';
import { StageParticipantService } from './stage-participant.service';

@Module({
  controllers: [StageParticipantController],
  providers: [StageParticipantService]
})
export class StageParticipantModule {}
