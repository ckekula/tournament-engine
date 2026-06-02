import { ChildEntity, ManyToOne } from "typeorm";
import { Group } from "./group.entity";
import { Round } from "./round.entity";

@ChildEntity(true)
export class GroupRound extends Round {
    @ManyToOne(() => Group, (group) => group.rounds)
    group: Group;
}