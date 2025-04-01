import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../../entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    roles: ['user'],
  } as User;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');
      
      expect(result).toEqual(mockUser);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should return null if user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');
      
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      
      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });
  });

  describe('login', () => {
    it('should return auth response with access token and user on successful login', async () => {
      const loginInput = { email: 'test@example.com', password: 'password123' };
      
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      const result = await service.login(loginInput);
      
      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: mockUser,
      });
      expect(service.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
        roles: ['user'],
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginInput = { email: 'test@example.com', password: 'wrongpassword' };
      
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginInput)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });
  });

  describe('register', () => {
    it('should register a new user and return auth response', async () => {
      const registerInput = { 
        email: 'new@example.com', 
        password: 'Password123!',
        firstname: 'New',
        lastname: 'User',
      };
      
      mockUserService.create.mockResolvedValue({ 
        ...mockUser, 
        id: 2, 
        email: registerInput.email 
      });

      const result = await service.register(registerInput);
      
      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: { ...mockUser, id: 2, email: registerInput.email },
      });
      expect(mockUserService.create).toHaveBeenCalledWith(registerInput);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 2,
        email: 'new@example.com',
        roles: ['user'],
      });
    });

    it('should propagate errors from user service', async () => {
      const registerInput = { 
        email: 'existing@example.com', 
        password: 'Password123!',
        firstname: 'New',
        lastname: 'User',
      };
      
      mockUserService.create.mockRejectedValue(new ConflictException('Email already in use'));

      await expect(service.register(registerInput)).rejects.toThrow(ConflictException);
      expect(mockUserService.create).toHaveBeenCalledWith(registerInput);
    });
  });

  describe('validateJwtPayload', () => {
    it('should return user if JWT payload is valid', async () => {
      const payload = { sub: 1, email: 'test@example.com', roles: ['user'] };
      
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await service.validateJwtPayload(payload);
      
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const payload = { sub: 999, email: 'nonexistent@example.com', roles: ['user'] };
      
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.validateJwtPayload(payload)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findOne).toHaveBeenCalledWith(999);
    });
  });
});