import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Tournament } from './tournament.entity';

@Entity()
@ObjectType()
export class Activity {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Field()
  name: string;

  @ManyToOne(() => Tournament, { nullable: false })
  @Field(() => Tournament, { nullable: false })
  tournament: Tournament;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();
}