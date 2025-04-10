import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Organization {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Field()
  slug: string;

  @Property()
  @Field()
  name: string;

  @ManyToOne(() => User)
  @Field(() => User)
  owner: User;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();
}