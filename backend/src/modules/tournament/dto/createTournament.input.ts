import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength, Matches, IsNumber } from 'class-validator';

@InputType()
export class CreateTournamentInput {
  @Field()
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  @MinLength(3, { message: 'Slug must be at least 3 characters' })
  @MaxLength(20, { message: 'Slug must be at most 20 characters' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  slug: string;

  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name: string;
  
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsNumber()
  organizerId: number;
}