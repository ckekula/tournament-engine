import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Matches } from 'class-validator';
import { Organization } from './organization.entity';
import { Participant } from './participant.entity';

@ChildEntity('INDIVIDUAL')
export abstract class Individual extends Participant {
  @Column({ length: 100 })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Participant name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ManyToOne(() => Organization)
  organization: Organization;
}