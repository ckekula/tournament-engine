import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Tournament } from './tournament.entity';
import { Matches } from 'class-validator';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  slug: string;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Organization name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => User, user => user.ownedOrganizations)
  owner: User;

  @ManyToMany(() => User, user => user.adminOrganizations)
  admins: User[];

  @OneToMany(() => Tournament, tournament => tournament.organizer)
  organizedTournaments: Tournament[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}