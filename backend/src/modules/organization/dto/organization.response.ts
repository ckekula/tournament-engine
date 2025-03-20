import { Field, ObjectType } from '@nestjs/graphql';
import { Organization } from 'src/entities/organization.entity';

@ObjectType()
export class OrganizationResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  organization?: Organization;
}