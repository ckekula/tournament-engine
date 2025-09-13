import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Activity } from './activity.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  slug: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  season: string;

  @ManyToOne(() => Organization, org => org.organizedTournaments)
  organizer: Organization;

  @OneToMany(() => Activity, activity => activity.tournament)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}