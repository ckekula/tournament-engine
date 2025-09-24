import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Stage } from './stage.entity';
import { Participant } from './participant.entity';

@Entity()
export abstract class StageParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stage, { onDelete: 'CASCADE' })
  stage: Stage;

  @ManyToOne(() => Participant, { onDelete: 'CASCADE' })
  participant: Participant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}