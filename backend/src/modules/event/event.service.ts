import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Activity } from 'src/entities/activity.entity';
import { _Event } from 'src/entities/event.entity';
import { CreateEventInput } from './dto/createEvent.input';
import { UpdateEventInput } from './dto/updateEvent.input';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: EntityRepository<Activity>,
    @InjectRepository(_Event)
    private readonly eventRepository: EntityRepository<_Event>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<_Event[]> {
    try {
      return await this.eventRepository.findAll({populate: ['activity']});
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch activities');
    }
  }

  async findOne(id: number): Promise<_Event> {
    try {
      const event = await this.eventRepository.findOne(
        { id },
        { populate: ['activity'] }
      );
      
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch event with ID ${id}`);
    }
  }

  async findByActivity(activityId: number): Promise<_Event[]> {
    try {
      return await this.eventRepository.find(
        { activity: activityId }, 
        { populate: ['activity'] }
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch events for activity with ID ${activityId}`);
    }
  }

  async create(createEventInput: CreateEventInput): Promise<_Event> {
    const { name, activityId, category } = createEventInput;

    try {
      // Get activity
      const activity = await this.activityRepository.findOne({ id: activityId });
      if (!activity) {
        throw new NotFoundException(`Activity with ID ${activityId} not found`);
      }

      // Create new event
      const event = this.eventRepository.create({
        name,
        activity: activity,
        category,
      });

      // Persist the activity
      await this.entityManager.persistAndFlush(activity);
      return event;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async update(id: number, updateEventInput: UpdateEventInput): Promise<_Event> {
    try {
      const { name, eventId, category } = updateEventInput;

      const event = await this.eventRepository.findOne(
        { id: eventId },
        { populate: ['activity'] }
      );
      
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      // Update name if provided
      if (name) {
        event.name = name;
      }

      // Update category if provided
      if (category) {
        event.category = category;
      }

      // Persist the updated organization
      await this.entityManager.persistAndFlush(event);
      return event;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update activity with ID ${id}`);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const event = await this.eventRepository.findOne({ id });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      await this.entityManager.removeAndFlush(event);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete event with ID ${id}`);
    }
  }
}