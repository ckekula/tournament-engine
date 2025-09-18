import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";
import { Stage } from "src/entities/stage.entity";
import { CreateStageInput } from "./dto/createStage.input";
import { UpdateStageInput } from "./dto/updateStage.input";
import { Event } from "src/entities/event.entity";
import { GroupStage } from "src/entities/group-stage.entity";
import { StageResponse } from "./dto/stage-response";
import { GroupStageResponse } from "./dto/stage-response";

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,
    @InjectRepository(GroupStage)
    private readonly groupStageRepository: Repository<GroupStage>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<StageResponse[]> {
    try {
      const stages = await this.stageRepository.find({
        relations: ['event'],
      });

      return stages.map(stage => StageResponse.fromEntity(stage));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stages');
    }
  }

  async findOne(id: number): Promise<StageResponse> {
    try {
      const stage = await this.stageRepository.findOne({
        where: { id },
      });

      if (!stage) {
        throw new NotFoundException(`Stage with ID ${id} not found`);
      }

      return StageResponse.fromEntity(stage);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch stage with ID ${id}`,
      );
    }
  }

  async findByEvent(eventId: number): Promise<StageResponse[]> {
    try {
      // This will automatically include the discriminator column
      const stages = await this.stageRepository
        .createQueryBuilder('stage')
        .leftJoinAndSelect('stage.event', 'event')
        .where('event.id = :eventId', { eventId })
        .getMany();
      
      return stages.map(stage => StageResponse.fromEntity(stage));
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch stages for event with ID ${eventId}`,
      );
    }
  }

  async create(createStageInput: CreateStageInput, userId: number): Promise<StageResponse> {
    const { name, format, eventId } = createStageInput;

    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
        relations: ['activity', 'activity.tournament', 'activity.tournament.organizer'],
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${createStageInput.eventId} not found`);
      }

      // Check if user has permission
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['adminOrganizations'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      const isUserAdmin = user.adminOrganizations.find(org => org.id === event.activity.tournament.organizer.id);

      if (!isUserAdmin) {
        throw new ConflictException(`User does not have permission to create activities for this tournament`);
      }

      const stage = this.stageRepository.create({name, format, event});
      const saved = await this.stageRepository.save(stage);
      return StageResponse.fromEntity(saved);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create stage');
    }
  }

  async createGroupStage(createStageInput: CreateStageInput, userId: number): Promise<GroupStageResponse> {
    const { name, format, eventId } = createStageInput;

    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
        relations: ['activity', 'activity.tournament', 'activity.tournament.organizer'],
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${createStageInput.eventId} not found`);
      }

      // Check if user has permission
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['adminOrganizations'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      const isUserAdmin = user.adminOrganizations.find(org => org.id === event.activity.tournament.organizer.id);

      if (!isUserAdmin) {
        throw new ConflictException(`User does not have permission to create activities for this tournament`);
      }

      const groupStage = this.groupStageRepository.create({name, format, event});
      const saved = await this.groupStageRepository.save(groupStage);
      return StageResponse.fromEntity(saved);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create group stage');
    }
  }

  async update(
    id: number,
    updateStageInput: UpdateStageInput,
  ): Promise<StageResponse> {
    try {
      const stage = await this.stageRepository.findOne({
        where: { id },
        relations: ['event'],
      });

      if (!stage) {
        throw new NotFoundException(`Stage with ID ${id} not found`);
      }

      Object.assign(stage, updateStageInput);

      const saved = await this.stageRepository.save(stage);
      return StageResponse.fromEntity(saved);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to update stage with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const stage = await this.stageRepository.findOne({
        where: { id },
      });
      if (!stage) {
        throw new NotFoundException(`Stage with ID ${id} not found`);
      }

      await this.stageRepository.remove(stage);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete stage with ID ${id}`,
      );
    }
  }
}