import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGroupStageParticipantInput {
  @IsNotEmpty({ message: 'Group ID is required' })
  @IsNumber()
  groupId: number;

  @IsNotEmpty({ message: 'Participant ID is required' })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  participantIds: number[];
}