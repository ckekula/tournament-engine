import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { ChangePasswordInput } from './dto/changePassword.input';
import { UserResponse } from './dto/user-response';

class ErrorResponseDto {
  statusCode: number;
  message: string;
  error: string;
}

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth() // Assuming JWT authentication
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user account with the provided information. Email must be unique.'
  })
  @ApiBody({ 
    type: CreateUserInput,
    description: 'User creation data'
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserResponse,
  })
  @ApiConflictResponse({
    description: 'Email already in use',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create user',
    type: ErrorResponseDto,
  })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system'
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: [UserResponse],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch users',
    type: ErrorResponseDto,
  })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch user',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ 
    summary: 'Get user by email',
    description: 'Retrieves a specific user by their email address'
  })
  @ApiParam({
    name: 'email',
    description: 'User email address',
    type: 'string',
    example: 'user@example.com',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch user',
    type: ErrorResponseDto,
  })
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Updates user information. Only provided fields will be updated.'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({ 
    type: UpdateUserInput,
    description: 'User update data'
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email already in use',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or user ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to update user',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(id, updateUserInput);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Permanently deletes a user account from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete user',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Change user password',
    description: 'Changes the password for a specific user. Requires current password verification.'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({ 
    type: ChangePasswordInput,
    description: 'Password change data'
  })
  @ApiOkResponse({
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password changed successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Current password is incorrect',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or user ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to change password',
    type: ErrorResponseDto,
  })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    changePasswordDto: ChangePasswordInput,
  ): Promise<{ message: string }> {
    await this.userService.changePassword(
      id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }
}