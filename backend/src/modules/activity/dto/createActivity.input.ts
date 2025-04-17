import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber, Matches } from 'class-validator';

@InputType()
export class CreateActivityInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @Matches(/^[A-Z0-9\s\-_]+$/, { 
    message: 'Name must be in uppercase letters, numbers, spaces, hyphens, and underscores only' 
  })
  name: string;
  
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'Tournament ID is required' })
  @IsNumber()
  tournamentId: number;
}