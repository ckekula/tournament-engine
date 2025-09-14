import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Activity } from "src/entities/activity.entity";
import { User } from "src/entities/user.entity";
import { CreateCategoryInput } from "./dto/createCategory.input";
import { Category } from "src/entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch categories");
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch category with ID ${id}`,
      );
    }
  }

  async findByActivity(activityId: number): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        where: { activity: { id: activityId } },
        relations: ["activity"],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch categories for activity with ID ${activityId}`,
      );
    }
  }

  async create(
    createCategoryInput: CreateCategoryInput,
    userId: number,
  ): Promise<Category> {
    const { name, activityId } = createCategoryInput;

    try {
      const activity = await this.activityRepository.findOne({
        where: { id: activityId },
        relations: ["tournament", "tournament.organizer"],
      });

      console.log('Activity fetched:', activity);

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
          `User does not have permission to create categories for this activity`,
        );
      }

      const category = this.categoryRepository.create({ name, activity });
      return await this.categoryRepository.save(category);
    } catch (error) {
      console.error('Error in category creation:', error);
      if (
        error instanceof NotFoundException || error instanceof ConflictException
      )
        throw error;
      throw new InternalServerErrorException("Failed to create category");
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await this.categoryRepository.remove(category);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete category with ID ${id}`,
      );
    }
  }
}
