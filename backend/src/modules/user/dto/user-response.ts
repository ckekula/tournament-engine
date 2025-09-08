import { User } from '../../../entities/user.entity';

export class UserResponse {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}