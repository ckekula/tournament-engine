import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity } from "src/entities/activity.entity";
import { Tournament } from "src/entities/tournament.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CreateActivityInput } from "./dto/createActivity.input";
import { UpdateActivityInput } from "./dto/updateActivity.input";

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Activity[]> {
    try {
      return await this.activityRepository.find({
        relations: ['tournament'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch activities');
    }
  }

  async findOne(id: number): Promise<Activity> {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id },
        relations: ['tournament'],
      });

      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch activity with ID ${id}`,
      );
    }
  }

  async findByTournament(tournamentId: number): Promise<Activity[]> {
    try {
      return await this.activityRepository.find({
        where: { tournament: { id: tournamentId } },
        relations: ['tournament'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch activities for tournament with ID ${tournamentId}`,
      );
    }
  }

  async create(createActivityInput: CreateActivityInput, userId: number): Promise<Activity> {
    const { name } = createActivityInput;

    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: createActivityInput.tournamentId },
        relations: ['organizer'],
      });

      if (!tournament) {
        throw new NotFoundException(`Tournament with ID ${createActivityInput.tournamentId} not found`);
      }

      // Check if user has permission
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['adminOrganizations'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const isUserAdmin = user.adminOrganizations.find(org => org.id === tournament.organizer.id);
      if (!isUserAdmin) {
        throw new ConflictException(`User does not have permission to create activities for this tournament`);
      }

      const activity = this.activityRepository.create({name, tournament});
      return await this.activityRepository.save(activity);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create activity');
    }
  }

  async update(
    id: number,
    updateActivityInput: UpdateActivityInput,
  ): Promise<Activity> {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id },
        relations: ['tournament'],
      });

      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      Object.assign(activity, updateActivityInput);

      return await this.activityRepository.save(activity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to update activity with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id },
      });
      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      await this.activityRepository.remove(activity);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete activity with ID ${id}`,
      );
    }
  }
}