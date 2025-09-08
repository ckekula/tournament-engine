export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: Date;
  updatedAt: Date;
}