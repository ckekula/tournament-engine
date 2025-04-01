import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Organization, User])],
    providers: [OrganizationResolver, OrganizationService],
    exports: [OrganizationService],
})
export class OrganizationModule {}