import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Stage } from './stage.entity';
import { RoundParticipant } from './roundParticipant.entity';

@Entity()
@TableInheritance({ column: { type: 'boolean', name: 'isGroupRound' } })
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Stage, (stage) => stage.rounds)
  stage: Stage;

  @OneToMany(() => RoundParticipant, (rp) => rp.round)
  roundParticipants: RoundParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}