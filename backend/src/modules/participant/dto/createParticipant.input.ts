import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches, IsEnum } from 'class-validator';

export class CreateParticipantInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organizationId: number;

  @IsNotEmpty({ message: 'Event ID is required' })
  @IsString({ message: 'Event ID must be a string' })
  eventId: number;
}