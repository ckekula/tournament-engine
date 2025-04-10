import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Organization } from 'src/entities/organization.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { OrganizationResponse } from './dto/organization-response';
import { ValidationPipe } from '@nestjs/common';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => [Organization], { name: 'organizations' })
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Query(() => Organization, { name: 'organization' })
  async findOne(@Args('id', { type: () => ID }) id: number): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @Query(() => Organization, { name: 'organizationBySlug' })
  async findBySlug(@Args('slug') slug: string): Promise<Organization> {
    return this.organizationService.findBySlug(slug);
  }

  @Query(() => [Organization], { name: 'organizationsByUser' })
  async findByUser(@Args('userId', { type: () => ID }) userId: number): Promise<Organization[]> {
    return this.organizationService.findByUser(userId);
  }

  @Mutation(() => OrganizationResponse)
  async createOrganization(
    @Args('createOrganizationInput', new ValidationPipe()) createOrganizationInput: CreateOrganizationInput,
  ): Promise<OrganizationResponse> {
    try {
      const organization = await this.organizationService.create(createOrganizationInput);
      return {
        success: true,
        message: 'Organization created successfully',
        organization,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create organization',
      };
    }
  }

  @Mutation(() => OrganizationResponse)
  async updateOrganization(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateOrganizationInput', new ValidationPipe()) updateOrganizationInput: UpdateOrganizationInput,
  ): Promise<OrganizationResponse> {
    try {
      const organization = await this.organizationService.update(id, updateOrganizationInput);
      return {
        success: true,
        message: 'Organization updated successfully',
        organization,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update organization',
      };
    }
  }

  @Mutation(() => OrganizationResponse)
  async removeOrganization(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<OrganizationResponse> {
    try {
      const result = await this.organizationService.remove(id);
      return {
        success: result,
        message: result ? 'Organization deleted successfully' : 'Failed to delete organization',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete organization',
      };
    }
  }
}