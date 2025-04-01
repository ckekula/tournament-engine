import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../entities/user.entity';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository;
  let mockEntityManager;

  const mockUser = {
    id: 123,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockUserRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    mockEntityManager = {
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.findAll.mockResolvedValue([mockUser]);
      
      const result = await service.findAll();
      
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });

    it('should throw an error if finding users fails', async () => {
      mockUserRepository.findAll.mockRejectedValue(new Error());
      
      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      const result = await service.findOne(123);
      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 123 });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createUserInput: CreateUserInput = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'Password123!',
    };

    it('should create a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      
      const result = await service.create(createUserInput);
      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: createUserInput.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserInput.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserInput,
        password: 'hashedPassword',
      });
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      await expect(service.create(createUserInput)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateUserInput: UpdateUserInput = {
      firstname: 'Jane',
    };

    it('should update a user', async () => {
      const updatedUser = { ...mockUser, firstname: 'Jane' };
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockEntityManager.persistAndFlush.mockResolvedValue(updatedUser);
      
      const result = await service.update(123, updateUserInput);
      
      expect(result.firstname).toEqual('Jane');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 123 });
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.update(123, updateUserInput)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockUserRepository.findOne.mockResolvedValueOnce({ ...mockUser, id: '456' }); // Different user with same email
      
      await expect(service.update(123, { email: 'existing@example.com' })).rejects.toThrow(ConflictException);
    });

    it('should hash password if provided', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      await service.update(123, { password: 'NewPassword123!' });
      
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      const result = await service.remove(123);
      
      expect(result).toBe(true);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 123 });
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });
});