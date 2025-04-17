import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Activity } from './activity.entity';

@Entity()
@ObjectType()
export class _Event {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  gender: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  weightClass: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
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