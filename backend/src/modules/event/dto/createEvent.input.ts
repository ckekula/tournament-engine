import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber, Matches } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Z0-9\s\-_]+$/, { 
    message: 'Name must be in uppercase letters, numbers, spaces, hyphens, and underscores only' 
  })
  name: string;
  
  @Field()
  @IsNotEmpty({ message: 'Activity ID is required' })
  @IsString({ message: 'Activity name must be a string' })
  activityName: string;

  @Field()
  @IsNotEmpty({ message: 'Tournament ID is required' })
  @IsNumber()
  tournamentId: number;

  @Field()
  @IsString({ message: 'Gender must be a string' })
  gender: string;

  @Field()
  @IsString({ message: 'Weight Class must be a string' })
  weightClass: string;

  @Field()
  @IsString({ message: 'Age Group must be a string' })
  ageGroup: string;
}