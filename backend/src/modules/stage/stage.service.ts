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

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Stage[]> {
    try {
      return await this.stageRepository.find({
        relations: ['event'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stages');
    }
  }

  async findOne(id: number): Promise<Stage> {
    try {
      const stage = await this.stageRepository.findOne({
        where: { id },
      });

      if (!stage) {
        throw new NotFoundException(`Stage with ID ${id} not found`);
      }

      return stage;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch stage with ID ${id}`,
      );
    }
  }

  async findByEvent(eventId: number): Promise<Stage[]> {
    try {
      return await this.stageRepository.find({
        where: { event: { id: eventId } },
        relations: ['event'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch stages for event with ID ${eventId}`,
      );
    }
  }

  async create(createStageInput: CreateStageInput, userId: number): Promise<Stage> {
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
      return await this.stageRepository.save(stage);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create stage');
    }
  }

  async update(
    id: number,
    updateStageInput: UpdateStageInput,
  ): Promise<Stage> {
    try {
      const stage = await this.stageRepository.findOne({
        where: { id },
        relations: ['event'],
      });

      if (!stage) {
        throw new NotFoundException(`Stage with ID ${id} not found`);
      }

      Object.assign(stage, updateStageInput);

      return await this.stageRepository.save(stage);
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