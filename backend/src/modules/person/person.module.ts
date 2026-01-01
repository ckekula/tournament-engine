import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { Participant } from 'src/entities/participant.entity';
import { Event } from 'src/entities/event.entity';
import { Team } from 'src/entities/team.entity';
import { Individual } from 'src/entities/Individual.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Participant, Event, Team, Individual, Organization, User])],
    controllers: [PersonController],
    providers: [PersonService],
    exports: [PersonService],
})
export class PersonModule {}