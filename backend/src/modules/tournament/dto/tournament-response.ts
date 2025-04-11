import { Field, ObjectType } from '@nestjs/graphql';
import { Tournament } from 'src/entities/tournament.entity';

@ObjectType()
export class TournamentResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  tournament?: Tournament;
}