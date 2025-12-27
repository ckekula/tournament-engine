import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Participant } from "src/entities/participant.entity";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { CreateParticipantInput } from "./dto/createParticipant.input";
import { UpdateParticipantInput } from "./dto/updateParticipant.input";
import { Event } from "src/entities/event.entity";
import { Team } from "src/entities/team.entity";
import { CreateTeamInput } from "./dto/createTeam.input";

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Participant[]> {
    try {
      return await this.participantRepository.find({
        relations: ["organizer"],
      });
    } catch (error) {
      console.log("error fetching participants: ", error);
      throw new InternalServerErrorException("Failed to fetch participants");
    }
  }

  async create(
    createParticipantInput: CreateParticipantInput,
    userId: number,
  ): Promise<Participant> {
    const { name, organizationId } = createParticipantInput;

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

    try {
      const participant = this.participantRepository.create({name, organization});

      return await this.participantRepository.save(participant);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException("Failed to create participant");
    }
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

}
