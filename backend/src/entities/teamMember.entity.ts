import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Team } from "./team.entity";
import { Person } from "./person.entity";

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Person, (person) => person.teamMemberships)
  person: Person;

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}