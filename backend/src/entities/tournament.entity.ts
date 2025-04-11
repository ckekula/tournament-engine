import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Organization } from './organization.entity';

@Entity()
@ObjectType()
export class Tournament {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Field()
  slug: string;

  @Property()
  @Field()
  name: string;

  @ManyToOne(() => Organization, { nullable: false })
  @Field(() => Organization, { nullable: false })
  organizer: Organization;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();
}