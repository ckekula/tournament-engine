import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateEventInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Event name can only contain letters, numbers, and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Event ID is required' })
  @IsNumber({}, { message: 'Event ID must be a number' })
  eventId: number;
}
