import { ChildEntity, ManyToOne } from 'typeorm';
import { Participant } from './participant.entity';
import { Person } from './person.entity';

@ChildEntity('INDIVIDUAL')
export class Individual extends Participant {
  @ManyToOne(() => Person, (person) => person.individualParticipations)
  person: Person;
}