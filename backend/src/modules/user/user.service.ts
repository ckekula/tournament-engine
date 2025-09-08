import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to fetch user with ID ${id}`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to fetch user with email ${email}`);
    }
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserInput.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

      // Create new user
      const user = this.userRepository.create({
        ...createUserInput,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check if email is being updated and already exists
      if (updateUserInput.email && updateUserInput.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserInput.email },
        });
        if (existingUser) {
          throw new ConflictException('Email already in use');
        }
      }

      // Merge updates
      Object.assign(user, updateUserInput);

      // Hash new password if provided
      if (updateUserInput.password) {
        user.password = await bcrypt.hash(updateUserInput.password, 10);
      }

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update user with ID ${id}`);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.userRepository.remove(user);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to delete user with ID ${id}`);
    }
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.findOne(id);

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash and update new password
      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);

      return true;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }
}
