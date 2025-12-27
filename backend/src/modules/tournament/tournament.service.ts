import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "src/entities/organization.entity";
import { Tournament } from "src/entities/tournament.entity";
import { Repository } from "typeorm";
import { CreateTournamentInput } from "./dto/createTournament.input";
import { UpdateTournamentInput } from "./dto/updateTournament.input";
import { User } from "src/entities/user.entity";
import { RegisterOrganizationInput } from "./dto/registerOrganization.input";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Tournament[]> {
    try {
      return await this.tournamentRepository.find({
        relations: ['organizer'],
      });
    } catch (error) {
      console.log("error fetching tournaments: ", error)
      throw new InternalServerErrorException('Failed to fetch tournaments');
    }
  }

  async findOne(id: number): Promise<Tournament> {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { id },
        relations: ['organization'],
      });

      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${id} not found`);
      }

      return tournament;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch tournament with ID ${id}`,
      );
    }
  }

  async findBySlug(slug: string): Promise<Tournament> {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { slug },
        relations: ['organization'],
      });

      if (!tournament) {
        throw new NotFoundException(`Tournament with slug "${slug}" not found`);
      }

      return tournament;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch tournament with slug ${slug}`,
      );
    }
  }

  async findOrganizer(tournamentId: number): Promise<Organization> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ['organizer'],
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }
    
    try {
      return tournament.organizer;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch organizer for tournament with ID ${tournamentId}: ${error}`,
      );
    }
  }

  async findByOrganization(organizationId: number): Promise<Tournament[]> {
    try {
      return await this.tournamentRepository.find({
        where: { organizer: { id: organizationId } },
        relations: ['organizer'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch tournaments for organization with ID ${organizationId}`,
      );
    }
  }

  async findRegisteredOrganizations(tournamentId: number): Promise<Organization[]> {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: tournamentId },
        relations: ['registeredOrganizations'],
      });

      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
      }

    try {
      return tournament.registeredOrganizations;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch registered organizations for tournament with ID ${tournamentId}`,
      );
    }
  }

  async registerOrganization(
    tournamentId: number,
    registeredOrganizationInput: RegisterOrganizationInput
  ): Promise<Tournament> {
    const { organizationId } = registeredOrganizationInput;

    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ['registeredOrganizations', 'organizer'],
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`
      );
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`
      );
    }

    if (tournament.organizer.id === organizationId) {
      throw new ConflictException(
        `Organization ${organizationId} is the organizer and cannot register`
      );
    }

    const alreadyRegistered = tournament.registeredOrganizations.some(
      org => org.id === organizationId
    );

    if (alreadyRegistered) {
      throw new ConflictException(
        `Organization ${organizationId} is already registered`
      );
    }

    try {
      tournament.registeredOrganizations.push(organization);
      return this.tournamentRepository.save(tournament);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to register organization with ID ${organizationId} for tournament with ID ${tournamentId}`,
      );
    }
  }


  async create(createTournamentInput: CreateTournamentInput, userId: number): Promise<Tournament> {
    const { slug, name, season } = createTournamentInput;

      // Check if current user is an admin of the organization
      const organizerId = createTournamentInput.organizerId;
      
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['adminOrganizations'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const isUserAdmin = user.adminOrganizations.find(org => org.id === organizerId);
      if (!isUserAdmin) {
        throw new ConflictException(`User does not have permission to create a tournament for organization with ID ${organizerId}`);
      }

      // Get organization
      const organizer = await this.organizationRepository.findOne({
        where: { id: organizerId },
      });
      if (!organizer) {
        throw new NotFoundException(`Organization with ID ${organizerId} not found`);
      }

    try {
      // Create new tournament
      const tournament = this.tournamentRepository.create({
        slug,
        name,
        season,
        organizer,
      });

      return await this.tournamentRepository.save(tournament);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create tournament');
    }
  }

  async update(
    id: number,
    updateTournamentInput: UpdateTournamentInput,
  ): Promise<Tournament> {
      const tournament = await this.tournamentRepository.findOne({
        where: { id },
        relations: ['organization'],
      });

      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${id} not found`);
      }

      const { slug, name } = updateTournamentInput;

      // Check if slug is being updated and already exists
      if (slug && slug !== tournament.slug) {
        const existingTournament = await this.tournamentRepository.findOne({
          where: { slug },
        });
        if (existingTournament) {
          throw new ConflictException(`Tournament with slug "${slug}" already exists`);
        }
        tournament.slug = slug;
      }

      if (name) {
        tournament.name = name;
      }

    try {
      return await this.tournamentRepository.save(tournament);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException(
        `Failed to update tournament with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { id },
      });
      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${id} not found`);
      }

      await this.tournamentRepository.remove(tournament);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete tournament with ID ${id}`,
      );
    }
  }
}