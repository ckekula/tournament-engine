import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Activity } from 'src/entities/activity.entity';
import { _Event } from 'src/entities/event.entity';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

@Module({
    imports: [MikroOrmModule.forFeature([Activity, _Event])],
    providers: [EventResolver, EventService],
    exports: [EventService],
})
export class EventModule {}