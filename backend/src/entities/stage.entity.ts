import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Matches } from 'class-validator';
import { Event } from './event.entity';
import { Format } from './format.enum';
import { Round } from './round.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Stage name can only contain letters, numbers, and spaces',
  })
  name: string;

  @Column({ type: 'enum', enum: Format })
  format: Format;

  @ManyToOne(() => Event, (event) => event.stages)
  event: Event;

  @OneToMany(() => Round, (round) => round.stage)
  rounds: Round[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}