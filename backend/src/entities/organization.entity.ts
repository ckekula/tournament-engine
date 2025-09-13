import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Tournament } from './tournament.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  slug: string;

  @Column({ length: 100 })
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