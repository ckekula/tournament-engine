import { Entity, Property, PrimaryKey, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Tournament {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Field()
  firstname: string;

  @Property()
  @Field()
  lastname: string;

  @Property()
  @Field()
  @Unique()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();
}