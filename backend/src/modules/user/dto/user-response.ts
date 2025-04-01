import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../entities/user.entity';

@ObjectType()
export class UserResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  user?: User;
}