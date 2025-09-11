import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Activity } from 'src/entities/activity.entity';
import { Event } from 'src/entities/event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Event, Activity, User])],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}