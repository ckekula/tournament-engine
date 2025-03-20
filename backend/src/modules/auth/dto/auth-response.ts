import { User } from 'src/entities/user.entity';

export class AuthResponse {
  accessToken: string;
  user: Partial<User>;
}