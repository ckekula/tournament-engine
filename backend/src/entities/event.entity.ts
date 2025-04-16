import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Activity } from './activity.entity';

@Entity()
@ObjectType()
export class _Event {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Field()
  name: string;

  @Property()
  @Field()
  gender: string;

  @Property()
  @Field()
  weightClass: string;

  @Property()
  @Field()
  ageGroup: string;

  @ManyToOne(() => Activity, { nullable: false })
  @Field(() => Activity, { nullable: false })
  activity: Activity;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();
}