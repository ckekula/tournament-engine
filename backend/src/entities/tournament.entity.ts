import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Activity } from './activity.entity';
import { Matches } from 'class-validator';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  slug: string;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Tournament name can only contain letters, numbers, and spaces',
  })
  name: string;

  @Column({ length: 20 })
  season: string;

  @ManyToOne(() => Organization, org => org.organizedTournaments)
  organizer: Organization;

  @JoinTable()
  @ManyToMany(() => Organization, org => org.registeredTournaments)
  registeredOrganizations: Organization[];

  @OneToMany(() => Activity, activity => activity.tournament)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}