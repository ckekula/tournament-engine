import { IsOptional, IsString, MaxLength, MinLength, Matches, IsArray, IsNumber } from 'class-validator';

export class UpdateOrganizationInput {
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  @MinLength(3, { message: 'Slug must be at least 3 characters' })
  @MaxLength(20, { message: 'Slug must be at most 20 characters' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name?: string;

  @IsOptional()
  @IsArray({ message: 'Admin IDs must be an array' })
  adminIds?: number[];
}