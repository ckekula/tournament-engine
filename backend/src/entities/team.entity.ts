import { ChildEntity, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TeamMember } from './teamMember.entity';
import { Participant } from './participant.entity';
import { Organization } from './organization.entity';

@ChildEntity('TEAM')
export class Team extends Participant {
  @OneToMany(() => TeamMember, (tm) => tm.team )
  members?: TeamMember[];

  @ManyToOne(() => Organization, (org) => org.teams)
  organization: Organization;
}