import { Entity, Property, PrimaryKey, Unique, OneToMany, ManyToMany, Collection } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Organization } from './organization.entity';

@Entity()
@ObjectType()
export class User {
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

  @Property({ type: 'array', default: ['user'] })
  @Field(() => [String])
  roles: string[];

  @Field(() => [Organization], { nullable: true })
  @OneToMany({ mappedBy: "owner" })
  ownedOrganizations = new Collection<Organization>(this);

  @Field(() => [Organization], { nullable: true })
  @ManyToMany(() => Organization)
  adminOrganizations = new Collection<Organization>(this);

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt: Date = new Date();

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();
}