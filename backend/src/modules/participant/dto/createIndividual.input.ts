import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches, IsEnum, IsArray } from 'class-validator';

export class CreateIndividualInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organizationId: number;
}