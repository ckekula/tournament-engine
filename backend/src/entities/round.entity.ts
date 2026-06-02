import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Matches } from 'class-validator';
import { Stage } from './stage.entity';

@Entity()
@TableInheritance({ column: { type: 'boolean', name: 'groupType' } })
export abstract class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Stage, (stage) => stage.rounds)
  stage: Stage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}