import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Group } from 'src/entities/group.entity';
import { GroupStage } from 'src/entities/groupStage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Group, GroupStage, User])],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}