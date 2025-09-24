import { ChildEntity, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Matches } from 'class-validator';
import { Organization } from './organization.entity';
import { TeamMember } from './teamMember.entity';
import { Participant } from './participant.entity';

@ChildEntity('TEAM')
export class Team extends Participant {
  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Team name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @OneToMany(() => TeamMember, (tm) => tm.team )
  members: TeamMember[];
}