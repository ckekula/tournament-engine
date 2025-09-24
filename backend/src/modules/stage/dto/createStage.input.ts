import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches, IsEnum } from 'class-validator';
import { Format } from 'src/entities/enums';

export class CreateStageInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Stage name can only contain letters, numbers, and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Format is required' })
  @IsEnum(Format, { message: 'Invalid format value' })
  format: Format;

  @IsNotEmpty({ message: 'Event ID is required' })
  @IsString({ message: 'Event ID must be a string' })
  eventId: number;
}