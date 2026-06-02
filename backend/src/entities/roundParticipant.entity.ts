import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Round } from "./round.entity";
import { Participant } from "./participant.entity";

@Entity()
export class RoundParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  performance: number;

  @ManyToOne(() => Round, (round) => round.roundParticipants)
  round: Round;

  @ManyToOne(() => Participant, { onDelete: 'CASCADE' })
  participant: Participant;

  @Column({ type: 'jsonb', nullable: true })
  stats: Record<string, any>;
}
