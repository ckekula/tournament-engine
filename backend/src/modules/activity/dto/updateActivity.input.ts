import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateActivityInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Activity name can only contain letters, numbers, and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Activity ID is required' })
  @IsNumber({}, { message: 'Activity ID must be a number' })
  activityId: number;
}
