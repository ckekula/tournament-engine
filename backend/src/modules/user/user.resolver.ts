import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserResponse } from './dto/user-response';
import { ValidationPipe } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Args('createUserInput', new ValidationPipe()) createUserInput: CreateUserInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.userService.create(createUserInput);
      return {
        success: true,
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create user',
      };
    }
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateUserInput', new ValidationPipe()) updateUserInput: UpdateUserInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.userService.update(id, updateUserInput);
      return {
        success: true,
        message: 'User updated successfully',
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update user',
      };
    }
  }

  @Mutation(() => UserResponse)
  async removeUser(@Args('id', { type: () => ID }) id: number): Promise<UserResponse> {
    try {
      const result = await this.userService.remove(id);
      return {
        success: result,
        message: result ? 'User deleted successfully' : 'Failed to delete user',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete user',
      };
    }
  }
}