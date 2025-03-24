import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { User } from 'src/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user?: User; // Add the 'user' property
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        // Verify JWT token
        const payload = this.jwtService.verify<JwtPayload>(token);
        const user = await this.authService.validateJwtPayload(payload);
        
        if (user) {
          req.user = user; // Attach user to request
        }
      } catch (error) {
        // Ignore invalid tokens (optional auth)
      }
    }

    next();
  }
}
