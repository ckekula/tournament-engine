import { Entity, Property, PrimaryKey, ManyToOne, Enum } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Activity } from './activity.entity';
import { ActivityCategory } from './category.enum';

@Entity()
@ObjectType()
export class _Event {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Field()
  name: string;

  @Enum(() => ActivityCategory)
  @Field(() => ActivityCategory)
  category: ActivityCategory;

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