import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Tournament } from './tournament.entity';
import { Event } from './event.entity';
import { Matches } from 'class-validator';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Activity name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Tournament, tourna => tourna.activities)
  tournament: Tournament;

  tournamentId: number;

  @OneToMany(() => Event, event => event.activity)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}