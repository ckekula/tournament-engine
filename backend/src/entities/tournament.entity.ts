import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

}