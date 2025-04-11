import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Tournament } from 'src/entities/tournament.entity';
import { Organization } from 'src/entities/organization.entity';
import { CreateTournamentInput } from './dto/createTournament.input';
import { UpdateTournamentInput } from './dto/updateTournament.input';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: EntityRepository<Organization>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: EntityRepository<Tournament>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<Tournament[]> {
    try {
      return await this.tournamentRepository.findAll({populate: ['organizer']});
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tournaments');
    }
  }

  async findOne(id: number): Promise<Tournament> {
    try {
      const tournament = await this.tournamentRepository.findOne(
        { id },
        { populate: ['organizer'] }
      );
      
      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${id} not found`);
      }
      
      return tournament;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch organization with ID ${id}`);
    }
  }

  async findBySlug(slug: string): Promise<Tournament> {
    try {
      const tournament = await this.tournamentRepository.findOne(
        { slug },
        { populate: ['organizer'] }
      );
      
      if (!tournament) {
        throw new NotFoundException(`Tournament with slug ${slug} not found`);
      }
      
      return tournament;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch tournament with slug ${slug}`);
    }
  }

  async findByOrganization(organizationId: number): Promise<Tournament[]> {
    try {
      return await this.tournamentRepository.find(
        { organizer: organizationId }, 
        { populate: ['organizer'] }
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch tournaments for organization with ID ${organizationId}`);
    }
  }

  async create(createTournamentInput: CreateTournamentInput): Promise<Tournament> {
    const { slug, name, organizerId } = createTournamentInput;

    try {
      // Check if slug already exists
      const existingOrg = await this.tournamentRepository.findOne({ slug });
      if (existingOrg) {
        throw new ConflictException(`Tournament with slug "${slug}" already exists`);
      }

      // Get organizer
      const org = await this.organizationRepository.findOne({ id: organizerId });
      if (!org) {
        throw new NotFoundException(`Organization with ID ${organizerId} not found`);
      }

      // Create new organization
      const tournament = this.tournamentRepository.create({
        slug,
        name,
        organizer: org,
      });

      // Persist the organization
      await this.entityManager.persistAndFlush(tournament);
      return tournament;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create tournament');
    }
  }

  async update(id: number, updateTournamentInput: UpdateTournamentInput): Promise<Tournament> {
    try {
      const tournament = await this.tournamentRepository.findOne(
        { id },
        { populate: ['organizer'] }
      );
      
      if (!tournament) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      const { slug, name, organizerId } = updateTournamentInput;

      // Check if slug is being updated and already exists
      if (slug && slug !== tournament.slug) {
        const existingOrg = await this.tournamentRepository.findOne({ slug });
        if (existingOrg) {
          throw new ConflictException(`Tournament with slug "${slug}" already exists`);
        }
        tournament.slug = slug;
      }

      // Update name if provided
      if (name) {
        tournament.name = name;
      }

      // Update organizer if provided
      if (organizerId) {
        const neworganizer = await this.organizationRepository.findOne({ id: organizerId });
        if (!neworganizer) {
          throw new NotFoundException(`User with ID ${organizerId} not found`);
        }
        tournament.organizer = neworganizer;
      }

      // Persist the updated organization
      await this.entityManager.persistAndFlush(tournament);
      return tournament;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update tournament with ID ${id}`);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const tournament = await this.tournamentRepository.findOne({ id });
      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${id} not found`);
      }

      await this.entityManager.removeAndFlush(tournament);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete tournament with ID ${id}`);
    }
  }
}