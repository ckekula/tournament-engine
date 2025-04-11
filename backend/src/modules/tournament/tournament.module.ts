import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentResolver } from './tournament.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organization } from 'src/entities/organization.entity';
import { Tournament } from 'src/entities/tournament.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Tournament, Organization])],
    providers: [TournamentResolver, TournamentService],
    exports: [TournamentService],
})
export class TournamentModule {}