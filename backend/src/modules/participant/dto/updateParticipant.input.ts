import { IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateParticipantInput {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name?: string;

}