import { Field, ObjectType } from '@nestjs/graphql';
import { Activity } from 'src/entities/activity.entity';

@ObjectType()
export class ActivityResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  activity?: Activity;
}