import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGroupStageParticipantInput {
  @IsNotEmpty({ message: 'Stage ID is required' })
  @IsNumber()
  stageId: number;

  @IsNotEmpty({ message: 'Group ID is required' })
  @IsNumber()
  groupId: number;

  @IsNotEmpty({ message: 'Participant ID is required' })
  @IsNumber()
  participantIds: number[];
}