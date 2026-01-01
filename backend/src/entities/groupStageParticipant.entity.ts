import { Entity, ManyToOne } from "typeorm";
import { StageParticipant } from "./stageParticipant.entity";
import { Group } from "./group.entity";

@Entity()
export class GroupStageParticipant extends StageParticipant {
  @ManyToOne(() => Group, { nullable: true, onDelete: 'CASCADE' })
  group: Group;
}