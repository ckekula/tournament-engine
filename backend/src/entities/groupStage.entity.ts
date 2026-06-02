import { ChildEntity, Entity, OneToMany } from "typeorm";
import { Stage } from "./stage.entity";
import { Group } from "./group.entity";

@ChildEntity(true)
export class GroupStage extends Stage {
    @OneToMany(() => Group, (group) => group.groupStage)
    groups: Group[];
}