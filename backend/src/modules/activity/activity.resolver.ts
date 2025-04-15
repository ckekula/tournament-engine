import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { Activity } from 'src/entities/activity.entity';
import { ActivityService } from './activity.service';
import { ActivityResponse } from './dto/activity-response';
import { CreateActivityInput } from './dto/createActivity.input';
import { UpdateActivityInput } from './dto/updateActivity.input';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Query(() => [Activity], { name: 'activities' })
  async findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Query(() => Activity, { name: 'activity' })
  async findOne(@Args('id', { type: () => ID }) id: number): Promise<Activity> {
    return this.activityService.findOne(id);
  }

  @Query(() => [Activity], { name: 'activitiesByTournament' })
  async findByTournament(@Args('tournaId', { type: () => ID }) organizationId: number): Promise<Activity[]> {
    return this.activityService.findByTournament(organizationId);
  }

  @Mutation(() => ActivityResponse)
  async createActivity(
    @Args('createActivityInput', new ValidationPipe()) createActivityInput: CreateActivityInput,
  ): Promise<ActivityResponse> {
    try {
      const activity = await this.activityService.create(createActivityInput);
      return {
        success: true,
        message: 'Activity created successfully',
        activity,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create activity',
      };
    }
  }

  @Mutation(() => ActivityResponse)
  async updateActivity(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateActivityInput', new ValidationPipe()) updateActivityInput: UpdateActivityInput,
  ): Promise<ActivityResponse> {
    try {
      const activity = await this.activityService.update(id, updateActivityInput);
      return {
        success: true,
        message: 'Activity updated successfully',
        activity,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update activity',
      };
    }
  }

  @Mutation(() => ActivityResponse)
  async removeTournament(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<ActivityResponse> {
    try {
      const result = await this.activityService.remove(id);
      return {
        success: result,
        message: result ? 'Activity deleted successfully' : 'Failed to delete activity',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete activity',
      };
    }
  }
}