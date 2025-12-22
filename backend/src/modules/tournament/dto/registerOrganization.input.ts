import { IsOptional, IsNumber } from 'class-validator';

export class RegisterOrganizationInput {
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organizationId: number;
}