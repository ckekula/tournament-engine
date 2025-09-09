import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Organization[]> {
    try {
      return await this.organizationRepository.find({
        relations: ['owner', 'admins'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch organizations');
    }
  }

  async findOne(id: number): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id },
        relations: ['owner', 'admins'],
      });

      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      return organization;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch organization with ID ${id}`,
      );
    }
  }

  async findBySlug(slug: string): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { slug },
        relations: ['owner', 'admins'],
      });

      if (!organization) {
        throw new NotFoundException(
          `Organization with slug "${slug}" not found`,
        );
      }

      return organization;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch organization with slug ${slug}`,
      );
    }
  }

  async findByUser(userId: number): Promise<Organization[]> {
    try {
      return await this.organizationRepository.find({
        where: { owner: { id: userId } },
        relations: ['owner', 'admins'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch organizations for user with ID ${userId}`,
      );
    }
  }

  async create(
    ownerId: number,
    createOrganizationInput: CreateOrganizationInput,
  ): Promise<Organization> {
    const { slug, name } = createOrganizationInput;

    console.log('Creating organization with slug:', slug, 'and ownerId:', ownerId);
    try {
      // Check if slug already exists
      const existingOrg = await this.organizationRepository.findOne({
        where: { slug },
      });
      if (existingOrg) {
        throw new ConflictException(
          `Organization with slug "${slug}" already exists`,
        );
      }

      // Get owner
      const ownerUser = await this.userRepository.findOne({
        where: { id: ownerId },
      });
      if (!ownerUser) {
        throw new NotFoundException(`User with ID ${ownerId} not found`);
      }

      // Create new organization
      const organization = this.organizationRepository.create({
        slug,
        name,
        owner: ownerUser,
        admins: [ownerUser],
      });

      return await this.organizationRepository.save(organization);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create organization');
    }
  }

  async update(
    id: number,
    updateOrganizationInput: UpdateOrganizationInput,
  ): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id },
        relations: ['owner', 'admins'],
      });

      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      const { slug, name, ownerId, adminIds } = updateOrganizationInput;

      // Check if slug is being updated and already exists
      if (slug && slug !== organization.slug) {
        const existingOrg = await this.organizationRepository.findOne({
          where: { slug },
        });
        if (existingOrg) {
          throw new ConflictException(
            `Organization with slug "${slug}" already exists`,
          );
        }
        organization.slug = slug;
      }

      // Update name if provided
      if (name) {
        organization.name = name;
      }

      // Update owner if provided
      if (ownerId) {
        const newOwner = await this.userRepository.findOne({
          where: { id: ownerId },
        });
        if (!newOwner) {
          throw new NotFoundException(`User with ID ${ownerId} not found`);
        }
        organization.owner = newOwner;

        // Ensure owner is in admins list
        if (!organization.admins.some((a) => a.id === newOwner.id)) {
          organization.admins.push(newOwner);
        }
      }

      // Update admins if provided
      if (adminIds) {
        const newAdmins: User[] = [];
        for (const adminId of adminIds) {
          const admin = await this.userRepository.findOne({
            where: { id: adminId },
          });
          if (!admin) {
            throw new NotFoundException(`User with ID ${adminId} not found`);
          }
          newAdmins.push(admin);
        }

        // Always keep the owner as admin
        if (
          !newAdmins.some((a) => a.id === organization.owner.id)
        ) {
          newAdmins.push(organization.owner);
        }

        organization.admins = newAdmins;
      }

      return await this.organizationRepository.save(organization);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException(
        `Failed to update organization with ID ${id}`,
      );
    }
  }

  async addAdmin(
    organizationId: number,
    userId: number,
  ): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
        relations: ['admins'],
      });

      if (!organization) {
        throw new NotFoundException(
          `Organization with ID ${organizationId} not found`,
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Check if user is already an admin
      if (organization.admins.some((a) => a.id === user.id)) {
        throw new ConflictException(
          `User with ID ${userId} is already an admin`,
        );
      }

      organization.admins.push(user);
      return await this.organizationRepository.save(organization);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException(
        `Failed to add admin to organization`,
      );
    }
  }

  async removeAdmin(
    organizationId: number,
    userId: number,
  ): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
        relations: ['owner', 'admins'],
      });

      if (!organization) {
        throw new NotFoundException(
          `Organization with ID ${organizationId} not found`,
        );
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Prevent removing the owner from admins
      if (organization.owner.id === userId) {
        throw new BadRequestException(`Cannot remove the owner from admins`);
      }

      // Check if user is an admin
      if (!organization.admins.some((a) => a.id === userId)) {
        throw new BadRequestException(
          `User with ID ${userId} is not an admin`,
        );
      }

      organization.admins = organization.admins.filter((a) => a.id !== userId);
      return await this.organizationRepository.save(organization);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to remove admin from organization`,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id },
      });
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      await this.organizationRepository.remove(organization);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete organization with ID ${id}`,
      );
    }
  }
}
