import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, IsArray, Matches } from 'class-validator';

export class CreateGroupInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Group name can only contain letters, numbers, and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'GroupStage ID is required' })
  @IsNumber({}, { message: 'GroupStage ID must be a number' })
  groupStageId: number;
}