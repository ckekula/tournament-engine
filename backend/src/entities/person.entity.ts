import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Matches } from 'class-validator';
import { Individual } from './Individual.entity';
import { TeamMember } from './teamMember.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Organization, (org) => org.persons)
  organization: Organization;

  @OneToMany(() => Individual, (individual) => individual.person)
  individualParticipations: Individual[];

  @OneToMany(() => TeamMember, (member) => member.person)
  teamMemberships: TeamMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}