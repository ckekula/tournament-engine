import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { Category } from './category.entity';
import { Matches } from 'class-validator';
import { Stage } from './stage.entity';
import { Participant } from './participant.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Event name can only contain letters, numbers, and spaces',
  })
  name: string;

  @Column({ nullable: true })
  maxTeamsPerOrg: number;

  @ManyToOne(() => Activity, activity => activity.events)
  activity: Activity;

  @OneToMany(() => Stage, stage => stage.event)
  stages: Stage[];

  @JoinTable()
  @ManyToMany(() => Participant, (participant) => participant.events)
  participants: Participant[];

  @JoinTable()
  @ManyToMany(() => Category, category => category.events)
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}