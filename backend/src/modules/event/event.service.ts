import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "src/entities/event.entity";
import { Activity } from "src/entities/activity.entity";
import { User } from "src/entities/user.entity";
import { CreateEventInput } from "./dto/createEvent.input";
import { UpdateEventInput } from "./dto/updateEvent.input";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Event[]> {
    try {
      return await this.eventRepository.find({
        relations: ["activity", "activity.tournament"],
      });
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch events");
    }
  }

  async findOne(id: number): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: ["activity", "activity.tournament"],
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      return event;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch event with ID ${id}`,
      );
    }
  }

  async findByActivity(activityId: number): Promise<Event[]> {
    try {
      return await this.eventRepository.find({
        where: { activity: { id: activityId } },
        relations: ["activity", "activity.tournament"],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch events for activity with ID ${activityId}`,
      );
    }
  }

  async create(
    createEventInput: CreateEventInput,
    userId: number,
  ): Promise<Event> {
    const { name, activityId } = createEventInput;

    try {
      const activity = await this.activityRepository.findOne({
        where: { id: activityId },
        relations: ["tournament", "tournament.organizer"],
      });

      if (!activity) {
        throw new NotFoundException(
          `Activity with ID ${activityId} not found`,
        );
      }

      // Check if user has permission through tournament organizer
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["adminOrganizations"],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const isUserAdmin = user.adminOrganizations.find(
        (org) => org.id === activity.tournament.organizer.id,
      );
      if (!isUserAdmin) {
        throw new ConflictException(
          `User does not have permission to create events for this activity`,
        );
      }

      const event = this.eventRepository.create({ name, activity });
      return await this.eventRepository.save(event);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      throw new InternalServerErrorException("Failed to create event");
    }
  }

  async update(id: number, updateEventInput: UpdateEventInput): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: ["activity", "activity.tournament"],
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      Object.assign(event, updateEventInput);

      return await this.eventRepository.save(event);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to update event with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      await this.eventRepository.remove(event);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete event with ID ${id}`,
      );
    }
  }
}
