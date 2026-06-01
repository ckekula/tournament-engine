import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Matches } from 'class-validator';
import { GroupStage } from './groupStage.entity';
import { GroupParticipant } from './groupStageParticipant.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Stage name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => GroupStage, (stage) => stage.groups)
  groupStage: GroupStage;

  @OneToMany(() => GroupParticipant, (participant) => participant.group, { nullable: true })
  groupParticipants: GroupParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}