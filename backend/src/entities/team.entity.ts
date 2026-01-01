import { ChildEntity, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TeamMember } from './teamMember.entity';
import { Participant } from './participant.entity';
import { Organization } from './organization.entity';
import { Matches } from 'class-validator';

@ChildEntity('TEAM')
export class Team extends Participant {
  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Participant name can only contain letters, numbers, and spaces',
  })
  name: string;

  @OneToMany(() => TeamMember, (tm) => tm.team )
  members?: TeamMember[];

  @ManyToOne(() => Organization, (org) => org.teams)
  organization: Organization;
}