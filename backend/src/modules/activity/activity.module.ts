import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { User } from 'src/entities/user.entity';
import { Activity } from 'src/entities/activity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Activity, Tournament, User])],
    controllers: [ActivityController],
    providers: [ActivityService],
    exports: [ActivityService],
})
export class ActivityModule {}