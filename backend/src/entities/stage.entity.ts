import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { IsNumber, Matches } from 'class-validator';
import { Event } from './event.entity';
import { Format, RoundType } from './enums';
import { StageParticipant } from './stageParticipant.entity';
import { Round } from './round.entity';

@Entity()
@TableInheritance({ column: { type: 'boolean', name: 'type' } })
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

  @Column({ nullable: true })
  @IsNumber()
  order?: number;

  @Column({ type: 'enum', enum: RoundType })
  roundType: RoundType;

  @ManyToOne(() => Event, (event) => event.stages)
  event: Event;

  @OneToMany(() => StageParticipant, (sp) => sp.stage)
  stageParticipants: StageParticipant[];

  @OneToMany(() => Round, (round) => round.stage)
  rounds: Round[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}