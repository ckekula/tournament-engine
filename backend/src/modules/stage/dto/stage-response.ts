import { Format } from "src/entities/format.enum";
import { EventResponse } from "src/modules/event/dto/event-response";
import { Stage } from "src/entities/stage.entity";
import { GroupStage } from "src/entities/group-stage.entity";

export class StageResponse {
  id: number;
  name: string;
  format: Format;
  event: EventResponse;
  isGroupStage: boolean = false;
  createdAt: Date;
  updatedAt: Date;

  // type checking method
  static fromEntity(stage: Stage): StageResponse | GroupStageResponse {
    const isGroupStage = stage instanceof GroupStage;
    
    if (isGroupStage) {
      const response = new GroupStageResponse();
      Object.assign(response, stage, { isGroupStage: true });
      return response;
    } else {
      const response = new StageResponse();
      Object.assign(response, stage, { isGroupStage: false });
      return response;
    }
  }
}

export class GroupStageResponse extends StageResponse {
    override isGroupStage = true;
}