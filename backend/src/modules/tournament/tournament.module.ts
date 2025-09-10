import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tournament, Organization, User])],
    controllers: [TournamentController],
    providers: [TournamentService],
    exports: [TournamentService],
})
export class TournamentModule {}