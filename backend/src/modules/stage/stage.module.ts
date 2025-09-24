import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Stage } from 'src/entities/stage.entity';
import { Event } from 'src/entities/event.entity';
import { GroupStage } from 'src/entities/groupStage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Stage, GroupStage, Event, User])],
    controllers: [StageController],
    providers: [StageService],
    exports: [StageService],
})
export class StageModule {}