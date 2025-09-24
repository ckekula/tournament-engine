import { GroupStageResponse } from "src/modules/stage/dto/stage-response";

export class GroupResponse {
  id: number;
  name: string;
  groupStage: GroupStageResponse;
  createdAt: Date;
  updatedAt: Date;
}