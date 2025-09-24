import { CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Event, (event) => event.participants)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}