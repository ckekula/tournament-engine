import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: EntityRepository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<Organization[]> {
    try {
      return await this.organizationRepository.findAll({populate: ['owner']});
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch organizations');
    }
  }

  async findOne(id: number): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne(
        { id },
        { populate: ['owner'] }
      );
      
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }
      
      return organization;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch organization with ID ${id}`);
    }
  }

  async findBySlug(slug: string): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne(
        { slug },
        { populate: ['owner'] }
      );
      
      if (!organization) {
        throw new NotFoundException(`Organization with slug ${slug} not found`);
      }
      
      return organization;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch organization with slug ${slug}`);
    }
  }

  async findByUser(userId: number): Promise<Organization[]> {
    try {
      return await this.organizationRepository.find(
        { owner: userId }, 
        { populate: ['owner'] }
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch organizations for user with ID ${userId}`);
    }
  }

  async create(createOrganizationInput: CreateOrganizationInput): Promise<Organization> {
    const { slug, name, ownerId } = createOrganizationInput;

    try {
      // Check if slug already exists
      const existingOrg = await this.organizationRepository.findOne({ slug });
      if (existingOrg) {
        throw new ConflictException(`Organization with slug "${slug}" already exists`);
      }

      // Get owner
      const ownerUser = await this.userRepository.findOne({ id: ownerId });
      if (!ownerUser) {
        throw new NotFoundException(`User with ID ${ownerId} not found`);
      }

      // Create new organization
      const organization = this.organizationRepository.create({
        slug,
        name,
        owner: ownerUser,
      });

      // Persist the organization
      await this.entityManager.persistAndFlush(organization);
      return organization;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create organization');
    }
  }

  async update(id: number, updateOrganizationInput: UpdateOrganizationInput): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne(
        { id },
        { populate: ['owner'] }
      );
      
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      const { slug, name, ownerId } = updateOrganizationInput;

      // Check if slug is being updated and already exists
      if (slug && slug !== organization.slug) {
        const existingOrg = await this.organizationRepository.findOne({ slug });
        if (existingOrg) {
          throw new ConflictException(`Organization with slug "${slug}" already exists`);
        }
        organization.slug = slug;
      }

      // Update name if provided
      if (name) {
        organization.name = name;
      }

      // Update owner if provided
      if (ownerId) {
        const newOwner = await this.userRepository.findOne({ id: ownerId });
        if (!newOwner) {
          throw new NotFoundException(`User with ID ${ownerId} not found`);
        }
        organization.owner = newOwner;
      }

      // Persist the updated organization
      await this.entityManager.persistAndFlush(organization);
      return organization;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update organization with ID ${id}`);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const organization = await this.organizationRepository.findOne({ id });
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      await this.entityManager.removeAndFlush(organization);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete organization with ID ${id}`);
    }
  }
}