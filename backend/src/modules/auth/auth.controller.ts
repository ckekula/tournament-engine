import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Public()
  @Post('register')
  async register(@Body() registerInput: RegisterInput): Promise<AuthResponse> {
    console.log('Register request received:', registerInput);
    return this.authService.register(registerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@CurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.refreshToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    // Remove sensitive data
    const { password, ...result } = user;
    return result;
  }
}