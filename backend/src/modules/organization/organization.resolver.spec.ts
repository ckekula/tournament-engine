import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { Organization } from '../../entities/organization.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Collection } from '@mikro-orm/core';

describe('OrganizationResolver', () => {
  let resolver: OrganizationResolver;
  let mockOrganizationService;

  const mockUser = {
    id: 123,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    ownedOrganizations: new Collection<Organization>(this),
    adminOrganizations: new Collection<Organization>(this),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;
  
  const mockOrganization = {
    id: 123,
    slug: 'test-org',
    name: 'Test Organization',
    owner: mockUser,
    admins: {
      getItems: jest.fn().mockReturnValue([mockUser]),
      add: jest.fn(),
      remove: jest.fn(),
    } as unknown as Collection<User>,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Organization;

  beforeEach(async () => {
    mockOrganizationService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      addAdmin: jest.fn(),
      removeAdmin: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationResolver,
        {
          provide: OrganizationService,
          useValue: mockOrganizationService,
        },
      ],
    }).compile();

    resolver = module.get<OrganizationResolver>(OrganizationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of organizations', async () => {
      const organizations = [mockOrganization];
      mockOrganizationService.findAll.mockResolvedValue(organizations);

      expect(await resolver.findAll()).toBe(organizations);
      expect(mockOrganizationService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single organization', async () => {
      mockOrganizationService.findOne.mockResolvedValue(mockOrganization);

      expect(await resolver.findOne(123)).toBe(mockOrganization);
      expect(mockOrganizationService.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('findBySlug', () => {
    it('should return an organization by slug', async () => {
      mockOrganizationService.findBySlug.mockResolvedValue(mockOrganization);

      expect(await resolver.findBySlug('test-org')).toBe(mockOrganization);
      expect(mockOrganizationService.findBySlug).toHaveBeenCalledWith('test-org');
    });
  });

  describe('findByUser', () => {
    it('should return an array of organizations for a user', async () => {
      const organizations = [mockOrganization];
      mockOrganizationService.findByUser.mockResolvedValue(organizations);

      expect(await resolver.findByUser(123)).toBe(organizations);
      expect(mockOrganizationService.findByUser).toHaveBeenCalledWith(123);
    });
  })

  describe('createOrganization', () => {
    it('should create and return an organization', async () => {
      const createOrganizationInput: CreateOrganizationInput = {
        name: 'New Organization',
        slug: 'new-org',
        ownerId: 123
      };

      mockOrganizationService.create.mockResolvedValue(mockOrganization);

      const result = await resolver.createOrganization(createOrganizationInput);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Organization created successfully');
      expect(result.organization).toBe(mockOrganization);
      expect(mockOrganizationService.create).toHaveBeenCalledWith(createOrganizationInput);
    });

    it('should handle errors during organization creation', async () => {
      const createOrganizationInput: CreateOrganizationInput = {
        name: 'New Organization',
        slug: 'new-org',
        ownerId: 123
      };

      const error = new ConflictException('Organization slug already exists');
      mockOrganizationService.create.mockRejectedValue(error);

      const result = await resolver.createOrganization(createOrganizationInput);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Organization slug already exists');
      expect(result.organization).toBeUndefined();
    });
  });

  describe('updateOrganization', () => {
    it('should update and return an organization', async () => {
      const updateOrganizationInput: UpdateOrganizationInput = {
        name: 'Updated Organization',
      };

      mockOrganizationService.update.mockResolvedValue(mockOrganization);

      const result = await resolver.updateOrganization(123, updateOrganizationInput);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Organization updated successfully');
      expect(result.organization).toBe(mockOrganization);
      expect(mockOrganizationService.update).toHaveBeenCalledWith(123, updateOrganizationInput);
    });

    it('should handle errors during organization update', async () => {
      const updateOrganizationInput: UpdateOrganizationInput = {
        name: 'Updated Organization',
      };

      const error = new NotFoundException('Organization not found');
      mockOrganizationService.update.mockRejectedValue(error);

      const result = await resolver.updateOrganization(999, updateOrganizationInput);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Organization not found');
      expect(result.organization).toBeUndefined();
    });
  });

  describe('addOrganizationAdmin', () => {
    it('should add an admin to an organization', async () => {
      mockOrganizationService.addAdmin.mockResolvedValue(mockOrganization);

      const result = await resolver.addOrganizationAdmin(123, 456);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Admin added to organization successfully');
      expect(result.organization).toBe(mockOrganization);
      expect(mockOrganizationService.addAdmin).toHaveBeenCalledWith(123, 456);
    });

    it('should handle errors when adding an admin', async () => {
      const error = new NotFoundException('Organization or user not found');
      mockOrganizationService.addAdmin.mockRejectedValue(error);

      const result = await resolver.addOrganizationAdmin(999, 999);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Organization or user not found');
      expect(result.organization).toBeUndefined();
    });
  });

  describe('removeOrganizationAdmin', () => {
    it('should remove an admin from an organization', async () => {
      mockOrganizationService.removeAdmin.mockResolvedValue(mockOrganization);

      const result = await resolver.removeOrganizationAdmin(123, 456);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Admin removed from organization successfully');
      expect(result.organization).toBe(mockOrganization);
      expect(mockOrganizationService.removeAdmin).toHaveBeenCalledWith(123, 456);
    });

    it('should handle errors when removing an admin', async () => {
      const error = new NotFoundException('Admin not found in organization');
      mockOrganizationService.removeAdmin.mockRejectedValue(error);

      const result = await resolver.removeOrganizationAdmin(123, 999);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Admin not found in organization');
      expect(result.organization).toBeUndefined();
    });
  });

  describe('removeOrganization', () => {
    it('should remove an organization and return success', async () => {
      mockOrganizationService.remove.mockResolvedValue(true);

      const result = await resolver.removeOrganization(123);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Organization deleted successfully');
      expect(mockOrganizationService.remove).toHaveBeenCalledWith(123);
    });

    it('should handle failed organization removal', async () => {
      mockOrganizationService.remove.mockResolvedValue(false);

      const result = await resolver.removeOrganization(123);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to delete organization');
    });

    it('should handle errors during organization removal', async () => {
      const error = new NotFoundException('Organization not found');
      mockOrganizationService.remove.mockRejectedValue(error);

      const result = await resolver.removeOrganization(999);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Organization not found');
    });
  });
});