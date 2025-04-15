import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { _Event } from 'src/entities/event.entity';
import { EventService } from './event.service';
import { CreateEventInput } from './dto/createEvent.input';
import { EventResponse } from './dto/event-response';
import { UpdateEventInput } from './dto/updateEvent.input';

@Resolver(() => _Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => [_Event], { name: 'events' })
  async findAll(): Promise<_Event[]> {
    return this.eventService.findAll();
  }

  @Query(() => _Event, { name: 'event' })
  async findOne(@Args('id', { type: () => ID }) id: number): Promise<_Event> {
    return this.eventService.findOne(id);
  }

  @Query(() => [_Event], { name: 'eventsByActivity' })
  async findByActivity(@Args('activityId', { type: () => ID }) activityId: number): Promise<_Event[]> {
    return this.eventService.findByActivity(activityId);
  }

  @Mutation(() => EventResponse)
  async createActivity(
    @Args('createEventInput', new ValidationPipe()) createEventInput: CreateEventInput,
  ): Promise<EventResponse> {
    try {
      const event = await this.eventService.create(createEventInput);
      return {
        success: true,
        message: 'Event created successfully',
        event,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create activity',
      };
    }
  }

  @Mutation(() => EventResponse)
  async updateActivity(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateActivityInput', new ValidationPipe()) updateEventInput: UpdateEventInput,
  ): Promise<EventResponse> {
    try {
      const event = await this.eventService.update(id, updateEventInput);
      return {
        success: true,
        message: 'Event updated successfully',
        event,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update activity',
      };
    }
  }

  @Mutation(() => EventResponse)
  async removeTournament(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<EventResponse> {
    try {
      const result = await this.eventService.remove(id);
      return {
        success: result,
        message: result ? 'Event deleted successfully' : 'Failed to delete event',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete event',
      };
    }
  }
}