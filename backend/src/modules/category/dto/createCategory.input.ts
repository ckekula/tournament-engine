import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateCategoryInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Category name can only contain letters, numbers, and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Activity slug is required' })
  @IsString({ message: 'Activity slug must be a string' })
  activitySlug: string;

  @IsNotEmpty({ message: 'Tournament ID is required' })
  @IsNumber({}, { message: 'Tournament ID must be a number' })
  tournamentId: number;
}