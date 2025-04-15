import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber } from 'class-validator';
import { ActivityCategory } from 'src/entities/category.enum';

@InputType()
export class UpdateEventInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name: string;
  
  @Field()
  @IsNotEmpty({ message: 'Event ID is required' })
  @IsNumber()
  eventId: number;

  @Field(() => ActivityCategory)
  @IsNotEmpty({ message: 'Category is required' })
  category: ActivityCategory;
}