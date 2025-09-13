import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { Event } from './event.entity';
import { Matches } from 'class-validator';

@Entity()
@Unique(['tournament', 'name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Category name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Activity, activity => activity.events)
  activity: Activity;

  @ManyToMany(() => Event, event => event.categories)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}