import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";
import { CreateGroupInput } from "./dto/createGroup.input";
import { UpdateGroupInput } from "./dto/updateGroup.input";
import { Group } from "src/entities/group.entity";
import { GroupStage } from "src/entities/groupStage.entity";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupStage)
    private readonly groupStageRepository: Repository<GroupStage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Group[]> {
    try {
      return await this.groupRepository.find({
        relations: ['groupStage'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch groups');
    }
  }

  async findOne(id: number): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['groupStage'],
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      return group;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch group with ID ${id}`,
      );
    }
  }

  async findByStage(stageId: number): Promise<Group[]> {
    try {
      return await this.groupRepository.find({
        where: { groupStage: { id: stageId } },
        relations: ['groupStage'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch groups for stage with ID ${stageId}`,
      );
    }
  }

  async create(createGroupInput: CreateGroupInput): Promise<Group> {
    const { name, groupStageId } = createGroupInput;

    try {
      const groupStage = await this.groupStageRepository.findOne({
        where: { id: groupStageId },
      });

      if (!groupStage) {
        throw new NotFoundException(
          `Group stage with ID ${groupStageId} not found`,
        );
      }

      // const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['adminOrganizations'] });
      // if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
      // const isUserAdmin = user.adminOrganizations.find(org => org.id === groupStage.event.activity.tournament.organizer.id);
      // if (!isUserAdmin) {
      //   throw new ConflictException(`User does not have permission to create groups for this stage`);
      // }

      const group = this.groupRepository.create({ name, groupStage });
      return await this.groupRepository.save(group);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException)
        throw error;
      throw new InternalServerErrorException('Failed to create group');
    }
  }

  async update(id: number, updateGroupInput: UpdateGroupInput): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['groupStage'],
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      Object.assign(group, updateGroupInput);

      return await this.groupRepository.save(group);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to update group with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id },
      });
      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      await this.groupRepository.remove(group);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete group with ID ${id}`,
      );
    }
  }
}
