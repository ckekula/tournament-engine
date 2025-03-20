import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let mockOrganizationRepository;
  let mockUserRepository;
  let mockEntityManager;

  const mockUser = {
    id: '123',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
  };

  const mockAdmin = {
    id: 456,
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
  };

  const mockOrganization = {
    id: 123,
    slug: 'test-org',
    name: 'Test Organization',
    owner: mockUser,
    admins: {
      contains: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
      removeAll: jest.fn(),
      getItems: jest.fn().mockReturnValue([mockUser]),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockOrganizationRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    mockEntityManager = {
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrganizationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of organizations', async () => {
      mockOrganizationRepository.findAll.mockResolvedValue([mockOrganization]);
      
      const result = await service.findAll();
      
      expect(result).toEqual([mockOrganization]);
      expect(mockOrganizationRepository.findAll).toHaveBeenCalled();
    });

    it('should throw an error if finding organizations fails', async () => {
      mockOrganizationRepository.findAll.mockRejectedValue(new Error());
      
      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return an organization by id', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      
      const result = await service.findOne(123);
      
      expect(result).toEqual(mockOrganization);
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ id: 123 }, { populate: ['owner', 'admins'] });
    });

    it('should throw NotFoundException if organization is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return an organization by slug', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      
      const result = await service.findBySlug('test-org');
      
      expect(result).toEqual(mockOrganization);
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ slug: 'test-org' }, { populate: ['owner', 'admins'] });
    });

    it('should throw NotFoundException if organization is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findBySlug('test-org')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createOrganizationInput: CreateOrganizationInput = {
      slug: 'test-org',
      name: 'Test Organization',
      ownerId: 123,
      adminIds: [456],
    };

    it('should create a new organization', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockUserRepository.findOne.mockResolvedValueOnce(mockAdmin);
      mockOrganizationRepository.create.mockReturnValue(mockOrganization);
      
      const result = await service.create(createOrganizationInput);
      
      expect(result).toEqual(mockOrganization);
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ slug: 'test-org' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '123' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 456 });
      expect(mockOrganizationRepository.create).toHaveBeenCalled();
      expect(mockOrganization.admins.add).toHaveBeenCalledWith(mockUser);
      expect(mockOrganization.admins.add).toHaveBeenCalledWith(mockAdmin);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockOrganization);
    });

    it('should throw ConflictException if slug already exists', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      
      await expect(service.create(createOrganizationInput)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if owner is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.create(createOrganizationInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateOrganizationInput: UpdateOrganizationInput = {
      name: 'Updated Organization',
    };

    it('should update an organization', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      
      const result = await service.update(123, updateOrganizationInput);
      
      expect(result.name).toEqual('Updated Organization');
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ id: 123 }, { populate: ['owner', 'admins'] });
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockOrganization);
    });

    it('should throw NotFoundException if organization is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      
      await expect(service.update(123, updateOrganizationInput)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if updated slug already exists', async () => {
      mockOrganizationRepository.findOne.mockResolvedValueOnce(mockOrganization);
      mockOrganizationRepository.findOne.mockResolvedValueOnce({ ...mockOrganization, id: 'org456' });
      
      await expect(service.update(123, { slug: 'existing-slug' })).rejects.toThrow(ConflictException);
    });
  });

  describe('addAdmin', () => {
    it('should add an admin to an organization', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);
      mockOrganization.admins.contains.mockReturnValue(false);
      
      const result = await service.addAdmin(123, 456);
      
      expect(result).toEqual(mockOrganization);
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ id: 123 }, { populate: ['admins'] });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 456 });
      expect(mockOrganization.admins.contains).toHaveBeenCalledWith(mockAdmin);
      expect(mockOrganization.admins.add).toHaveBeenCalledWith(mockAdmin);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockOrganization);
    });

    it('should throw NotFoundException if organization is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      
      await expect(service.addAdmin(123, 456)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.addAdmin(123, 456)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if user is already an admin', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);
      mockOrganization.admins.contains.mockReturnValue(true);
      
      await expect(service.addAdmin(123, 456)).rejects.toThrow(ConflictException);
    });
  });

  describe('removeAdmin', () => {
    it('should remove an admin from an organization', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue({
        ...mockOrganization,
        owner: { id: '123' },
      });
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);
      mockOrganization.admins.contains.mockReturnValue(true);
      
      const result = await service.removeAdmin(123, 456);
      
      expect(result).toEqual(mockOrganization);
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ id: 123 }, { populate: ['owner', 'admins'] });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 456 });
      expect(mockOrganization.admins.contains).toHaveBeenCalledWith(mockAdmin);
      expect(mockOrganization.admins.remove).toHaveBeenCalledWith(mockAdmin);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockOrganization);
    });

    it('should throw BadRequestException if trying to remove owner from admins', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue({
        ...mockOrganization,
        owner: { id: '123' },
      });
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      await expect(service.removeAdmin(123, 123)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is not an admin', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);
      mockOrganization.admins.contains.mockReturnValue(false);
      
      await expect(service.removeAdmin(123, 456)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if organization is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      
      await expect(service.removeAdmin(123, 456)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(mockOrganization);
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.removeAdmin(123, 456)).rejects.toThrow(NotFoundException);
    });
  });
});