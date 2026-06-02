import { ChildEntity, ManyToOne } from "typeorm";
import { Group } from "./group.entity";
import { Round } from "./round.entity";

@ChildEntity('GROUP_ROUND')
export class GroupRound extends Round {
    @ManyToOne(() => Group, (group) => group.rounds)
    group!: Group;
}