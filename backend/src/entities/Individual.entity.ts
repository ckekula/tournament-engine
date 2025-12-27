import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Participant } from './participant.entity';

@ChildEntity('INDIVIDUAL')
export abstract class Individual extends Participant {
}