export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}