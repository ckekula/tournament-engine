import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Matches } from 'class-validator';
import { Event } from './event.entity';
import { Format } from './enums';
import { StageParticipant } from './stageParticipant.entity';

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

  @OneToMany(() => StageParticipant, (sp) => sp.stage)
  stageParticipants: StageParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}