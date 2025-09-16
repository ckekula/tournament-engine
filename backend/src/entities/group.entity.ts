import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Matches } from 'class-validator';
import { Round } from './round.entity';
import { GroupStage } from './group-stage.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}