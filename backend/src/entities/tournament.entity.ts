import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  slug?: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  season: string;

  @ManyToOne(() => Organization, org => org.organizedTournaments)
  organizer: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}