import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/entities/user.entity';
import { AuthResponse } from './dto/auth-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
  
    if (!user) {
      return null;
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
      const user = await this.validateUser(loginInput.email, loginInput.password);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const payload: JwtPayload = { 
        sub: user.id, 
        email: user.email,
        roles: user.roles || ['user'] 
      };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    try {
      const user = await this.userService.create(registerInput);

      if (!user) {
        throw new InternalServerErrorException('Failed to create user');
      }
      
      const payload: JwtPayload = { 
        sub: user.id, 
        email: user.email,
        roles: user.roles || ['user']
      };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      // Let the original error from userService.create propagate
      throw error;
    }
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.userService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Token validation failed');
    }
  }

  async refreshToken(user: User): Promise<AuthResponse> {
    try {
      const payload: JwtPayload = { 
        sub: user.id, 
        email: user.email,
        roles: user.roles || ['user']
      };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException('Token refresh failed');
    }
  }
}