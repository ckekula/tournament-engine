import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name: string;
  
  @Field()
  @IsNotEmpty({ message: 'Activity ID is required' })
  @IsNumber()
  activityId: number;

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