import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstname: 'Test',
    lastname: 'User',
    roles: ['user'],
  } as User;

  const mockAuthResponse = {
    accessToken: 'mock.jwt.token',
    user: {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['user'],
    },
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return auth response on successful login', async () => {
      const loginDto: LoginInput = { 
        email: 'test@example.com', 
        password: 'password123' 
      };
      
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);
      
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return auth response on successful registration', async () => {
      const registerDto: RegisterInput = { 
        email: 'new@example.com', 
        password: 'Password123!',
        firstname: 'New',
        lastname: 'User',
      };
      
      const expectedResponse = {
        ...mockAuthResponse,
        user: { 
          ...mockAuthResponse.user, 
          email: 'new@example.com',
          firstname: 'New',
          lastname: 'User',
        },
      };
      
      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);
      
      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('refreshToken', () => {
    it('should return auth response with new token', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refreshToken(mockUser);
      
      expect(result).toEqual(mockAuthResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile without password', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      
      const result = controller.getProfile(mockUser);
      
      expect(result).toEqual(userWithoutPassword);
    });
  });
});