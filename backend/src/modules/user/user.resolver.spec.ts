import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Organization } from 'src/entities/organization.entity';
import { Collection } from '@mikro-orm/core';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let mockUserService;

  const mockUser: Partial<User> = {
    id: 123,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    ownedOrganizations: new Collection<Organization>(this),
    adminOrganizations: new Collection<Organization>(this),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockUserService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserService.findAll.mockResolvedValue([mockUser]);
      
      const result = await resolver.findAll();
      
      expect(result).toEqual([mockUser]);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      
      const result = await resolver.findOne(123);
      
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('createUser', () => {
    const createUserInput: CreateUserInput = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'Password123!',
    };

    it('should create a user and return success response', async () => {
      mockUserService.create.mockResolvedValue(mockUser);
      
      const result = await resolver.createUser(createUserInput);
      
      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        user: mockUser,
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserInput);
    });

    it('should return failure response if creation fails', async () => {
      mockUserService.create.mockRejectedValue(new ConflictException('Email already in use'));
      
      const result = await resolver.createUser(createUserInput);
      
      expect(result).toEqual({
        success: false,
        message: 'Email already in use',
      });
    });
  });

  describe('updateUser', () => {
    const updateUserInput: UpdateUserInput = {
      firstname: 'Jane',
    };

    it('should update a user and return success response', async () => {
      const updatedUser = { ...mockUser, firstname: 'Jane' };
      mockUserService.update.mockResolvedValue(updatedUser);
      
      const result = await resolver.updateUser(123, updateUserInput);
      
      expect(result).toEqual({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      });
      expect(mockUserService.update).toHaveBeenCalledWith(123, updateUserInput);
    });

    it('should return failure response if update fails', async () => {
      mockUserService.update.mockRejectedValue(new NotFoundException('User not found'));
      
      const result = await resolver.updateUser(123, updateUserInput);
      
      expect(result).toEqual({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('removeUser', () => {
    it('should remove a user and return success response', async () => {
      mockUserService.remove.mockResolvedValue(true);
      
      const result = await resolver.removeUser(123);
      
      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully',
      });
      expect(mockUserService.remove).toHaveBeenCalledWith(123);
    });

    it('should return failure response if removal fails', async () => {
      mockUserService.remove.mockRejectedValue(new NotFoundException('User not found'));
      
      const result = await resolver.removeUser(123);
      
      expect(result).toEqual({
        success: false,
        message: 'User not found',
      });
    });
  });
});