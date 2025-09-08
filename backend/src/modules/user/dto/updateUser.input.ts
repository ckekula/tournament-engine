import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserInput {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstname?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Length(8, 100, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and numbers or special characters',
  })
  password?: string;
}