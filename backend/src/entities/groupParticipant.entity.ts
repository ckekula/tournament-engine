import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Participant } from './participant.entity';
import { Group } from "./group.entity";

@Entity()
export class GroupParticipant {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Participant, { onDelete: 'CASCADE' })
  participant!: Participant;

  @ManyToOne(() => Group, { nullable: true, onDelete: 'CASCADE' })
  group!: Group;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}