import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { Event } from './event.entity';
import { Organization } from './organization.entity';
import { Matches } from 'class-validator';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Participant name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToMany(() => Event, (event) => event.participants)
  events: Event[];

  @ManyToOne(() => Organization)
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}