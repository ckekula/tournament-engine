import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { Organization } from 'src/entities/organization.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { AddAdminInput } from './dto/addAdmin.input';
import { OrganizationResponse } from './dto/organization-response';

class ErrorResponseDto {
  statusCode: number;
  message: string;
  error: string;
}

@ApiTags('Organizations')
@Controller('organizations')
@ApiBearerAuth() // Assuming JWT authentication
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new organization',
    description: 'Creates a new organization with the provided information. Slug must be unique. The owner is automatically added as an admin.'
  })
  @ApiBody({
    type: CreateOrganizationInput,
    description: 'Organization creation data'
  })
  @ApiCreatedResponse({
    description: 'Organization successfully created',
    type: OrganizationResponse,
  })
  @ApiConflictResponse({
    description: 'Organization slug already exists',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Owner or admin user not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create organization',
    type: ErrorResponseDto,
  })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOrganizationInput: CreateOrganizationInput,
  ): Promise<Organization> {
    return await this.organizationService.create(createOrganizationInput);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all organizations',
    description: 'Retrieves a list of all organizations in the system with their owners and admins'
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: 'integer',
    description: 'Filter organizations by owner user ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'List of organizations retrieved successfully',
    type: [OrganizationResponse],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch organizations',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
  ): Promise<Organization[]> {
    if (userId) {
      return await this.organizationService.findByUser(userId);
    }
    return await this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Retrieves a specific organization by its unique identifier with owner and admin details'
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Organization retrieved successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid organization ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch organization',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Organization> {
    return await this.organizationService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get organization by slug',
    description: 'Retrieves a specific organization by its unique slug with owner and admin details'
  })
  @ApiParam({
    name: 'slug',
    description: 'Organization slug',
    type: 'string',
    example: 'my-company',
  })
  @ApiOkResponse({
    description: 'Organization retrieved successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch organization',
    type: ErrorResponseDto,
  })
  async findBySlug(@Param('slug') slug: string): Promise<Organization> {
    return await this.organizationService.findBySlug(slug);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get organizations by user',
    description: 'Retrieves all organizations owned by a specific user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Organizations retrieved successfully',
    type: [OrganizationResponse],
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch organizations',
    type: ErrorResponseDto,
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Organization[]> {
    return await this.organizationService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Updates organization information. Only provided fields will be updated. Owner is automatically kept as admin.'
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    type: UpdateOrganizationInput,
    description: 'Organization update data'
  })
  @ApiOkResponse({
    description: 'Organization updated successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({
    description: 'Organization, owner, or admin user not found',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Organization slug already exists',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or organization ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to update organization',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateOrganizationInput: UpdateOrganizationInput,
  ): Promise<Organization> {
    return await this.organizationService.update(id, updateOrganizationInput);
  }

  @Post(':id/admins')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add admin to organization',
    description: 'Adds a user as an admin to the organization. User must exist and not already be an admin.'
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    type: AddAdminInput,
    description: 'User ID to add as admin'
  })
  @ApiOkResponse({
    description: 'Admin added successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({
    description: 'Organization or user not found',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'User is already an admin',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or organization ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to add admin',
    type: ErrorResponseDto,
  })
  async addAdmin(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    addAdminDto: AddAdminInput,
  ): Promise<Organization> {
    return await this.organizationService.addAdmin(organizationId, addAdminDto.userId);
  }

  @Delete(':id/admins/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove admin from organization',
    description: 'Removes a user from organization admins. Cannot remove the owner from admins.'
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: 'integer',
    example: 1,
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to remove from admins',
    type: 'integer',
    example: 2,
  })
  @ApiOkResponse({
    description: 'Admin removed successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({
    description: 'Organization or user not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Cannot remove owner from admins or user is not an admin',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to remove admin',
    type: ErrorResponseDto,
  })
  async removeAdmin(
    @Param('id', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Organization> {
    return await this.organizationService.removeAdmin(organizationId, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Permanently deletes an organization from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Organization deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Organization deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid organization ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete organization',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.organizationService.remove(id);
    return { message: 'Organization deleted successfully' };
  }
}