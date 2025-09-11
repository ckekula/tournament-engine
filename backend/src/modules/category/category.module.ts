import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Activity } from 'src/entities/activity.entity';
import { Category } from 'src/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Activity, User])],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}