import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tournament } from 'src/entities/tournament.entity';
import { Activity } from 'src/entities/activity.entity';
import { ActivityResolver } from './activity.resolver';
import { ActivityService } from './activity.service';

@Module({
    imports: [MikroOrmModule.forFeature([Activity, Tournament])],
    providers: [ActivityResolver, ActivityService],
    exports: [ActivityService],
})
export class ActivityModule {}