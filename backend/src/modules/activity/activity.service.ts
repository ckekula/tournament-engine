import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Tournament } from 'src/entities/tournament.entity';
import { Activity } from 'src/entities/activity.entity';
import { CreateActivityInput } from './dto/createActivity.input';
import { UpdateActivityInput } from './dto/updateActivity.input';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: EntityRepository<Activity>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: EntityRepository<Tournament>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<Activity[]> {
    try {
      return await this.activityRepository.findAll({populate: ['tournament']});
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch activities');
    }
  }

  async findOne(id: number): Promise<Activity> {
    try {
      const activity = await this.activityRepository.findOne(
        { id },
        { populate: ['tournament'] }
      );
      
      if (!activity) {
        throw new NotFoundException(`Tournament with ID ${id} not found`);
      }
      
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch organization with ID ${id}`);
    }
  }

  async findByTournament(tournaId: number): Promise<Activity[]> {
    try {
      return await this.activityRepository.find(
        { tournament: tournaId }, 
        { populate: ['tournament'] }
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch activities for tournament with ID ${tournaId}`);
    }
  }

  async create(createActivityInput: CreateActivityInput): Promise<Activity> {
    const { name, tournamentId } = createActivityInput;

    try {
      // Get organizer
      const tourna = await this.tournamentRepository.findOne({ id: tournamentId });
      if (!tourna) {
        throw new NotFoundException(`Organization with ID ${tournamentId} not found`);
      }

      // Create new activity
      const activity = this.activityRepository.create({
        name,
        tournament: tourna,
      });

      // Persist the activity
      await this.entityManager.persistAndFlush(activity);
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create activity');
    }
  }

  async update(id: number, updateActivityInput: UpdateActivityInput): Promise<Activity> {
    try {
      const { name, activityId } = updateActivityInput;

      const activity = await this.activityRepository.findOne(
        { id: activityId },
        { populate: ['tournament'] }
      );
      
      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      // Update name if provided
      if (name) {
        activity.name = name;
      }

      // Persist the updated organization
      await this.entityManager.persistAndFlush(activity);
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update activity with ID ${id}`);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const activity = await this.activityRepository.findOne({ id });
      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      await this.entityManager.removeAndFlush(activity);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to activity tournament with ID ${id}`);
    }
  }
}