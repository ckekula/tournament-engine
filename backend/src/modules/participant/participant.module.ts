import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { Participant } from 'src/entities/participant.entity';
import { Event } from 'src/entities/event.entity';
import { Team } from 'src/entities/team.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Participant, Event, Team, Organization, User])],
    controllers: [ParticipantController],
    providers: [ParticipantService],
    exports: [ParticipantService],
})
export class ParticipantModule {}