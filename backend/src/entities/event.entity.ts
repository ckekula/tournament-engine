import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { Category } from './category.entity';
import { Matches } from 'class-validator';

@Entity()
@Unique(['tournament', 'name'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Event name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Activity, activity => activity.events)
  activity: Activity;

  @JoinTable()
  @ManyToMany(() => Category, category => category.events)
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}