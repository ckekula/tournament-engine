import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { CreateIndividualInput } from "./dto/createIndividual.input";
import { Event } from "src/entities/event.entity";
import { Team } from "src/entities/team.entity";
import { CreateTeamInput } from "./dto/createTeam.input";
import { Individual } from "src/entities/Individual.entity";

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Individual)
    private readonly individualRepository: Repository<Individual>,
  ) {}

  // async createIndividual(
  //   createIndividualInput: CreateIndividualInput,
  //   userId: number,
  // ): Promise<Individual> {
  //   const { name, organizationId } = createIndividualInput;

  //   // Check if user is admin of organization
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ["adminOrganizations"],
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${userId} not found`);
  //   }

  //   const isUserAdmin = user.adminOrganizations.find(
  //     (org) => org.id === organizationId,
  //   );

  //   if (!isUserAdmin) {
  //     throw new ConflictException(
  //       `User does not have permission to create a participant for organization with ID ${organizationId}`,
  //     );
  //   }

  //   // Get organization
  //   const organization = await this.organizationRepository.findOne({
  //     where: { id: organizationId },
  //   });

  //   if (!organization) {
  //     throw new NotFoundException(`Organization with ID ${organizationId} not found`);
  //   }

  //   try {
  //     const individual = this.individualRepository.create({name, organization});

  //     return await this.individualRepository.save(individual);
  //   } catch (error) {
  //     if (error instanceof NotFoundException || error instanceof ConflictException)
  //       throw error;
  //     throw new InternalServerErrorException("Failed to create individual participant");
  //   }
  // }

  async assignIndividualToEvents(
    individualId: number,
    eventIds: number[],
    userId: number,
  ): Promise<void> {
    const individual = await this.individualRepository.findOne({
      where: { id: individualId },
      relations: ["events"],
    });

    if (!individual) {
      throw new NotFoundException(`Individual with ID ${individualId} not found`);
    }

    const events = await this.eventRepository.find({
      where: { id: In(eventIds) },
    });

    if (events.length !== eventIds.length) {
      throw new NotFoundException("One or more events not found");
    }

    individual.events = [...individual.events, ...events];
    await this.individualRepository.save(individual);
  }



  async createTeam(
    createTeamInput: CreateTeamInput,
    userId: number,
  ): Promise<Team> {
    const { name, organizationId, eventId } = createTeamInput;

    // Check if user is admin of organization
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["adminOrganizations"],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isUserAdmin = user.adminOrganizations.find(
      (org) => org.id === organizationId,
    );

    if (!isUserAdmin) {
      throw new ConflictException(
        `User does not have permission to create a participant for organization with ID ${organizationId}`,
      );
    }

    // Get organization
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }

    // Get event
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    try {
      const team = this.teamRepository.create({name, organization, events: [event]});

      return await this.teamRepository.save(team);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException("Failed to create team");
    }
  }

  async getTeamsByOrganizationAndTournament(
    organizationId: number,
    tournamentId: number
  ): Promise<Team[]> {
    try {
      return await this.teamRepository
        .createQueryBuilder("team")
        .leftJoinAndSelect("team.organization", "organization")
        .leftJoinAndSelect("team.events", "event")
        .leftJoinAndSelect("event.activity", "activity")
        .leftJoinAndSelect("activity.tournament", "tournament")
        .where("organization.id = :organizationId", { organizationId })
        .andWhere("tournament.id = :tournamentId", { tournamentId })
        .getMany();
    } catch (error) {
      console.error("error fetching teams by organization and tournament:", error);
      throw new InternalServerErrorException("Failed to fetch teams");
    }
  }

}
