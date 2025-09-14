import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Matches } from 'class-validator';
import { Event } from './event.entity';
import { Format } from './format.enum';

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Stage name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Event, (event) => event.stages)
  event: Event;

  @Column({ length: 50 })
  format: Format;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}