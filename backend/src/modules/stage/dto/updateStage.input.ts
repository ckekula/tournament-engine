import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateStageInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Stage name can only contain letters, numbers, and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Stage ID is required' })
  @IsString({ message: 'Stage ID must be a string' })
  stageId: number;
}