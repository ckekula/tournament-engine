import { Field, ObjectType } from '@nestjs/graphql';
import { _Event } from 'src/entities/event.entity';

@ObjectType()
export class EventResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  event?: _Event;
}