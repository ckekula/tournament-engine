import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { NotFoundException, ConflictException } from '@nestjs/common';

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

  const mockOrganization = {
    id: 123,
    slug: 'test-org',
    name: 'Test Organization',
    owner: mockUser,
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
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ id: 123 }, { populate: ['owner'] });
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
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith(
        { slug: 'test-org' }, { populate: ['owner'] }
      );
    });

    it('should throw NotFoundException if organization is not found', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findBySlug('test-org')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return an array of organizations for a user', async () => {
      mockOrganizationRepository.findAll.mockResolvedValue([mockOrganization]);
      
      const result = await service.findByUser(123);
      
      expect(result).toEqual([mockOrganization]);
      expect(mockOrganizationRepository.findAll).toHaveBeenCalledWith(
        { owner: { id: 123 } }, { populate: ['owner'] }
      );
    });
  });

  describe('create', () => {
    const createOrganizationInput: CreateOrganizationInput = {
      slug: 'test-org',
      name: 'Test Organization',
      ownerId: 123,
    };

    it('should create a new organization', async () => {
      mockOrganizationRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockOrganizationRepository.create.mockReturnValue(mockOrganization);
      
      const result = await service.create(createOrganizationInput);
      
      expect(result).toEqual(mockOrganization);
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ slug: 'test-org' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '123' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 456 });
      expect(mockOrganizationRepository.create).toHaveBeenCalled();
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
      expect(mockOrganizationRepository.findOne).toHaveBeenCalledWith({ id: 123 }, { populate: ['owner'] });
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
});