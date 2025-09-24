import { ChildEntity, Entity, ManyToOne, OneToMany } from "typeorm";
import { Team } from "./team.entity";
import { Individual } from "./Individual.entity";

@ChildEntity('TEAM_MEMBER')
export class TeamMember extends Individual {
    @ManyToOne(() => Team, (team) => team.members)
    team: Team;
}